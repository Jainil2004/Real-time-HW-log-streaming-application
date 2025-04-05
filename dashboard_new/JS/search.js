// document.addEventListener("DOMContentLoaded", function () {
//     const queryTypeDivs = document.querySelectorAll("#queryType > div");
//     const queryPanels = {
//         Datesearch: document.getElementById("queryParameters_datetime"),
//         anomalySearch: document.getElementById("queryParameters_anomaly"),
//         manualSearch: document.getElementById("queryResultPanel") // Adjust if needed
//     };

//     queryTypeDivs.forEach(div => {
//         div.addEventListener("click", function () {
//             // Remove highlight from all options
//             queryTypeDivs.forEach(d => d.classList.remove("selected"));

//             // Highlight the clicked option
//             this.classList.add("selected");

//             // Reduce opacity for all panels
//             Object.values(queryPanels).forEach(panel => panel.classList.remove("active"));

//             // Increase opacity for the relevant panel
//             if (queryPanels[this.id]) {
//                 queryPanels[this.id].classList.add("active");
//             }
//         });
//     });

//     // Gather input data and send to backend
//     const submitQuery = document.getElementById("submitQuery");
//     submitQuery.addEventListener("click", function () {
//         const startDate = document.getElementById("startDateInput").value;
//         const endDate = document.getElementById("endDateInput").value;
//         const startTime = document.getElementById("startTimeInput").value;
//         const endTime = document.getElementById("endTimeInput").value;

//         const queryData = {
//             startDate,
//             endDate,
//             startTime,
//             endTime
//         };

//         console.log("Query Data:", queryData); // For debugging

//         // Send data to Flask backend
//         fetch("/search", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(queryData)
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log("Search Results:", data);
//             // Display results in the queryResultPanel
//             const resultPanel = document.getElementById("queryResultPanel");
//             resultPanel.innerHTML = JSON.stringify(data, null, 2); // Format results
//         })
//         .catch(error => console.error("Error:", error));
//     });
// });

document.addEventListener("DOMContentLoaded", function () {
    const submitQuery = document.getElementById("submitQuery");

    submitQuery.addEventListener("click", function () {
        const startDate = document.getElementById("startDateInput").value;
        const endDate = document.getElementById("endDateInput").value;
        const startTime = document.getElementById("startTimeInput").value;
        const endTime = document.getElementById("endTimeInput").value;

        if (!startDate) {
            alert("Please select a start date.");
            return;
        }

        const queryData = {
            startDate,
            endDate: endDate || startDate, // Default to same day if not provided
            startTime: startTime || "00:00:00.000",
            endTime: endTime || "23:59:59.999"
        };

        console.log("Query Data:", queryData); // Debugging

        fetch("/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(queryData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Search Results:", data);
            displayResults(data);
        })
        .catch(error => console.error("Error:", error));
    });

    function displayResults(data) {
        const resultPanel = document.getElementById("queryResultPanel");
        resultPanel.innerHTML = "<h3>Search Results</h3>";

        if (data.hits && data.hits.hits.length > 0) {
            data.hits.hits.forEach(hit => {
                const logEntry = document.createElement("pre");
                logEntry.textContent = JSON.stringify(hit._source, null, 2);
                resultPanel.appendChild(logEntry);
            });
        } else {
            resultPanel.innerHTML += "<p>No results found.</p>";
        }
    }
});
