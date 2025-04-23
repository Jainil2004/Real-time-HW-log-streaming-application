window.addEventListener("DOMContentLoaded", () => {
    fetch("/system-info")
        .then(response => response.json())
        .then(data => {
            document.getElementById("System").textContent = `System: ${data.System}`;
            document.getElementById("Processor").textContent = `Processor: ${data.Processor}`;
            document.getElementById("graphics").textContent = `Graphics: ${data.Graphics}`;
            document.getElementById("Memory").textContent = `Memory: ${data.Memory}`;
            document.getElementById("Storage").textContent = `Storage: ${data.Storage}`;
            document.getElementById("OS").textContent = `Windows: ${data.OS}`;
        })
        .catch(error => {
            console.error("Failed to load system info:", error);
        });
});
