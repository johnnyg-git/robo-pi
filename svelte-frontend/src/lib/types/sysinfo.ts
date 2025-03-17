export interface CpuInfo {
  model: string;
  count: number;
  speed: string;
  usage: string;
}

export interface MemoryInfo {
  total: string;
  used: string;
  free: string;
  usagePercent: string;
}

export interface SystemInfo {
  platform: string;
  release: string;
  hostname: string;
  uptime: string;
}

export interface SysInfoSuccessResponse {
  status: "success";
  timestamp: string;
  cpu: CpuInfo;
  memory: MemoryInfo;
  system: SystemInfo;
}

export interface SysInfoErrorResponse {
  status: "error";
  message: string;
  error: string;
}
