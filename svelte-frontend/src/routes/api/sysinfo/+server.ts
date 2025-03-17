import os from "os";
import { json, type RequestHandler } from "@sveltejs/kit";
import type {
  SysInfoSuccessResponse,
  SysInfoErrorResponse,
} from "$lib/types/sysinfo";

/**
 * GET handler for the /api/metrics endpoint
 * Returns various server metrics including CPU, RAM, and system information
 */
export const GET: RequestHandler = async () => {
  try {
    // Get CPU information
    const cpus = os.cpus();
    const cpuCount = cpus.length;
    const cpuModel = cpus[0].model;
    const cpuSpeed = cpus[0].speed;

    // Calculate CPU usage (this gives a point-in-time snapshot)
    const cpuUsage = await calculateCpuUsage();

    // Get memory information (in bytes)
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercent = ((usedMemory / totalMemory) * 100).toFixed(2);

    // Get system information
    const platform = os.platform();
    const release = os.release();
    const uptime = os.uptime(); // in seconds
    const hostname = os.hostname();

    // Format uptime into readable format
    const uptimeFormatted = formatUptime(uptime);

    const response: SysInfoSuccessResponse = {
      status: "success",
      timestamp: new Date().toISOString(),
      cpu: {
        model: cpuModel,
        count: cpuCount,
        speed: `${cpuSpeed} MHz`,
        usage: `${cpuUsage}%`,
      },
      memory: {
        total: formatBytes(totalMemory),
        used: formatBytes(usedMemory),
        free: formatBytes(freeMemory),
        usagePercent: `${memoryUsagePercent}%`,
      },
      system: {
        platform,
        release,
        hostname,
        uptime: uptimeFormatted,
      },
    };

    return json(response);
  } catch (error) {
    console.error("Error getting system metrics:", error);

    const errorResponse: SysInfoErrorResponse = {
      status: "error",
      message: "Failed to retrieve system metrics",
      error: error instanceof Error ? error.message : String(error),
    };

    return json(errorResponse, { status: 500 });
  }
};

/**
 * Calculate the CPU usage percentage
 * This is a simple implementation that measures usage over a short interval
 */
async function calculateCpuUsage(): Promise<string> {
  const cpus = os.cpus();

  return new Promise((resolve) => {
    cpus.map((cpu) => {
      const total = Object.values(cpu.times).reduce(
        (acc, time) => acc + time,
        0
      );

      const usage = 100 - (100 * cpu.times.idle) / total;
      resolve(usage.toFixed(2));
    });
  });
}

/**
 * Format bytes to a human-readable string
 */
function formatBytes(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

/**
 * Format uptime seconds to a readable format
 */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
}
