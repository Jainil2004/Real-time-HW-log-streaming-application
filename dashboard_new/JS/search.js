document.addEventListener("DOMContentLoaded", function () {
    const queryParametersDateTime = document.getElementById("queryParameters_datetime");
    const queryParametersAnomaly = document.getElementById("queryParameters_anomaly");
    const queryResultPanel = document.getElementById("queryResultPanel");

    const dateSearchBtn = document.getElementById("Datesearch");
    const anomalySearchBtn = document.getElementById("anomalySearch");
    const manualSearchBtn = document.getElementById("manualSearch");
    const submitQueryBtn = document.getElementById("submitQuery");

    // Hide all query parameters initially
    function hideAllQueryParameters() {
        queryParametersDateTime.style.display = "none";
        queryParametersAnomaly.style.display = "none";
        queryResultPanel.style.display = "none";
    }

    hideAllQueryParameters(); // Ensure everything is hidden initially

    // Event Listeners for search type selection
    dateSearchBtn.addEventListener("click", function () {
        hideAllQueryParameters();
        queryParametersDateTime.style.display = "block"; // Show DateTime input
    });

    anomalySearchBtn.addEventListener("click", function () {
        hideAllQueryParameters();
        queryParametersAnomaly.style.display = "block"; // Show Anomaly input
    });

    manualSearchBtn.addEventListener("click", function () {
        hideAllQueryParameters();
        alert("Manual search is not implemented yet!");
    });

    // Handle Submit Query (just displaying selected values for now)
    submitQueryBtn.addEventListener("click", function () {
        queryResultPanel.style.display = "block"; // Show result panel
        queryResultPanel.innerHTML = "<p>Processing search query...</p>";

        // Example: Fetch values from query parameters
        if (queryParametersDateTime.style.display === "block") {
            const startDate = document.getElementById("startDate").innerText;
            const endDate = document.getElementById("endDate").innerText;
            const startTime = document.getElementById("startTime").innerText;
            const endTime = document.getElementById("endTime").innerText;

            queryResultPanel.innerHTML = `<pre>Searching logs from:
Start Date: ${startDate}
End Date: ${endDate}
Start Time: ${startTime}
End Time: ${endTime}
</pre>`;
        } else if (queryParametersAnomaly.style.display === "block") {
            queryResultPanel.innerHTML = "<p>Searching for anomalies...</p>";
        } else {
            queryResultPanel.innerHTML = "<p>No search type selected.</p>";
        }
    });
});
