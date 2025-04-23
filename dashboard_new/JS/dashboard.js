document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "http://localhost:5000/dashboard";
    
    const chartConfigs = [
        { id: "coreClocksChart", label: "Core Clocks", key: "Core_Clocks_avg_MHz", max: 5800 },
        { id: "ringClocksChart", label: "Ring Clocks", key: "Ring_LLC_Clock_MHz", max: 5000 },
        { id: "coreVIDChart", label: "Core VID", key: "Core_VIDs_avg_V", max: 1.5 },
        { id: "coreUsageChart", label: "Core Usage", key: "Core_Usage_avg_percent", max: 100 },
        { id: "packageTempChart", label: "CPU Package Temp", key: "CPU_Package_C", max: 100 },
        { id: "packagePowerChart", label: "Package Power", key: "CPU_Package_Power_W", max: 200 },
        { id: "coreTempChart", label: "Core Temperature", key: "Core_Temperatures_avg_C", max: 100 },
        { id: "distToTjMAXChart", label: "Distance to TjMAX", key: "Core_Distance_to_TjMAX_avg_C", max: 100 },
        { id: "Pl1Chart", label: "PL1 Dynamic Power", key: "PL1_Power_Limit_Dynamic_W", max: 140 },
        { id: "PL2Chart", label: "PL2 Dynamic Power", key: "PL2_Power_Limit_Dynamic_W", max: 190 },
        
        // for V2.0: added CPU and GPU fan speed charts
        {id: "CPUFanSpeedChart", label: "CPU Fan RPM", key: "CPU_FAN_RPM", max: 5600},
        {id: "GPUFanSpeedChart", label: "GPU Fan RPM", key: "GPU_FAN_RPM", max: 5600}
    ];
    
    function getBarColor(label, value) {
        if (label.includes("Temp")) return value > 90 ? "red" : value > 70 ? "orange" : "green";
        if (label.includes("Usage")) return value > 80 ? "red" : value > 50 ? "orange" : "green";
        if (label.includes("PL1_Power")) return value > 150 ? "red" : value > 100 ? "orange" : "green";
        if (label.includes("PL2_Power")) return value > 150 ? "red" : value > 100 ? "orange" : "green";
        if (label.includes("TjMAX")) return value < 20 ? "red" : value > 40 ? "green" : "orange";
        if (label.includes("Fan")) return value < 3700 ? "green" : value < 4400 ? "orange" : "red" // added label for CPU and GPU fans {V2.X}
        return "green";
    }
    
    let charts = {};
    chartConfigs.forEach(config => {
        let ctx = document.getElementById(config.id).getContext("2d");
        charts[config.id] = new Chart(ctx, {
            type: "bar",
            data: {
                labels: [config.label],
                datasets: [{
                    label: config.label,
                    data: [0],
                    backgroundColor: "green",
                    borderColor: "white",
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                scales: {
                    x: { ticks: { color: "white" }, max: config.max },
                    y: { ticks: { color: "white" } }
                }
            }
        });
    });
    
    // async function fetchData() {
    //     try {
    //         const response = await fetch(apiUrl);
    //         const data = await response.json();
    //         if (data.length === 0) return;
            
    //         let latestData = data[data.length - 1];
    //         const cpuPackage = latestData.CPU_Package_C;
            
    //         // Check thermal throttling
    //         document.getElementById("coreThermalThrottling").innerHTML =
    //             latestData.Core_Thermal_Throttling === 1.0 ? "WARNING: CPU Core Thermal Throttling || CPU Package: " : "CPU Package: " + cpuPackage + " [°C]" + " (No Thermal or Power Limit Throttling detected)";

    //         let systemState;
    //         const usage = latestData.Core_Usage_avg_percent;
            
    //         if (usage < 15) {
    //             systemState = "CPU core usage: " + usage + "% || State: System currently Idling (low or no CPU load)";
    //         } else if (usage < 60) {
    //             systemState = "CPU core usage: " + usage + "% || State: System active and under moderate stress";
    //         } else if (usage < 80) {
    //             systemState = "CPU core usage: " + usage + "% || State: System under heavy load";
    //         } else {
    //             systemState = "CPU core usage: " + usage + "% || State: System under extreme load";
    //         }
            
    //         document.getElementById("systemState").innerHTML = systemState;
    //         chartConfigs.forEach(config => {
    //             let value = latestData[config.key];
    //             charts[config.id].data.datasets[0].data = [value];
    //             charts[config.id].data.datasets[0].backgroundColor = getBarColor(config.label, value);
    //             charts[config.id].update();
    //         });
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     }
    // }

    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.length === 0) return;
            
            let latestData = data[data.length - 1];
            const cpuPackage = latestData.CPU_Package_C;
            const coreThermalThrottlingDiv = document.getElementById("coreThermalThrottling");
    
            // Check thermal throttling and update background color
            if (latestData.Core_Thermal_Throttling === 1.0) {
                coreThermalThrottlingDiv.innerHTML = "⚠ WARNING: CPU Core Thermal Throttling || CPU Package: " + cpuPackage + " [°C]";
                coreThermalThrottlingDiv.style.backgroundColor = "red";
                coreThermalThrottlingDiv.style.color = "white";
                coreThermalThrottlingDiv.style.padding = "10px";
                coreThermalThrottlingDiv.style.borderRadius = "5px";
                coreThermalThrottlingDiv.style.fontWeight = "bold";
            } else {
                coreThermalThrottlingDiv.innerHTML = "CPU Package: " + cpuPackage + " [°C] (No Thermal or Power Limit Throttling detected)";
                coreThermalThrottlingDiv.style.backgroundColor = "transparent";
                coreThermalThrottlingDiv.style.color = "white";
                coreThermalThrottlingDiv.style.fontWeight = "normal";
            }
    
            let systemState;
            const usage = latestData.Core_Usage_avg_percent;
            
            if (usage < 15) {
                systemState = "🟢 CPU core usage: " + usage + "% || State: System currently Idling (low or no CPU load)";
            } else if (usage < 60) {
                systemState = "🟡 CPU core usage: " + usage + "% || State: System active and under moderate stress";
            } else if (usage < 80) {
                systemState = "🟠 CPU core usage: " + usage + "% || State: System under heavy load";
            } else {
                systemState = "🔴 CPU core usage: " + usage + "% || State: System under extreme load";
            }
    
            document.getElementById("systemState").innerHTML = systemState;
    
            chartConfigs.forEach(config => {
                let value = latestData[config.key];
                charts[config.id].data.datasets[0].data = [value];
                charts[config.id].data.datasets[0].backgroundColor = getBarColor(config.label, value);
                charts[config.id].update();
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    
    
    fetchData();
    setInterval(fetchData, 2000);
});
