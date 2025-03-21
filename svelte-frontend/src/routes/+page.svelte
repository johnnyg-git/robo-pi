<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import type { SysInfoSuccessResponse, SysInfoErrorResponse } from '$lib/types/sysinfo';

    let sysinfo: SysInfoSuccessResponse;
    let error: string;
    let intervalId: NodeJS.Timeout;

    async function fetchSysInfo() {
        try {
            const response = await fetch('/api/sysinfo');
            const data: SysInfoSuccessResponse | SysInfoErrorResponse = await response.json();
            console.log(data);
            if (data.status === 'success') {
                sysinfo = data;
            } else {
                error = data.message;
            }
        } catch (err) {
            error = 'Failed to fetch system information';
        }
    }

    onMount(() => {
        fetchSysInfo();
        intervalId = setInterval(fetchSysInfo, 500);
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });
</script>

<div class="sysinfo">
    <h2>System Information</h2>
    {#if error}
        <div class="error">{error}</div>
    {:else if sysinfo}
        <div class="infosection">
            <section>
                <h3>CPU</h3>
                <p><strong>Model:</strong> {sysinfo.cpu.model}</p>
                <p><strong>Count:</strong> {sysinfo.cpu.count}</p>
                <p><strong>Speed:</strong> {sysinfo.cpu.speed}</p>
                <p><strong>Usage:</strong> {sysinfo.cpu.usage}</p>
            </section>

            <section>
                <h3>Memory</h3>
                <p><strong>Total:</strong> {sysinfo.memory.total}</p>
                <p><strong>Used:</strong> {sysinfo.memory.used}</p>
                <p><strong>Free:</strong> {sysinfo.memory.free}</p>
                <p><strong>Usage Percent:</strong> {sysinfo.memory.usagePercent}</p>
            </section>

            <section>
                <h3>System</h3>
                <p><strong>Platform:</strong> {sysinfo.system.platform}</p>
                <p><strong>Release:</strong> {sysinfo.system.release}</p>
                <p><strong>Hostname:</strong> {sysinfo.system.hostname}</p>
                <p><strong>Uptime:</strong> {sysinfo.system.uptime}</p>
            </section>

            <section>
                <h3>Timestamp</h3>
                <p><strong>Timestamp:</strong></p>
                <p>{sysinfo.timestamp}</p>
            </section>
        </div>
    {:else}
        <div>Loading...</div>
    {/if}
 </div>

<style>
    .sysinfo {
        padding: 1rem;
        background-color: var(--bg-color);
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: 80%;
        margin: 0 auto;
    }

    .infosection {
        display: flex;
        justify-content: space-around;
        gap: 2rem;
        flex-wrap: wrap;
    }

    .infosection section {
        flex: 1 1 25%;
        box-sizing: border-box;
        min-width: 200px; /* Set a fixed minimum width */
    }

    @media (max-width: 1000px) {
        .sysinfo {
            width: 95%;
        }

        .infosection section {
            flex: 1 1 100%;
        }
    }

    .error {
        color: lightcoral;
    }
</style>
