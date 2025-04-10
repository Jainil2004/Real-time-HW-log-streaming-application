// // document.addEventListener("DOMContentLoaded", function () {
// //     const queryTypeDivs = document.querySelectorAll("#queryType > div");
// //     const queryPanels = {
// //         Datesearch: document.getElementById("queryParameters_datetime"),
// //         anomalySearch: document.getElementById("queryParameters_anomaly"),
// //         manualSearch: document.getElementById("queryResultPanel") // Adjust if needed
// //     };

// //     queryTypeDivs.forEach(div => {
// //         div.addEventListener("click", function () {
// //             // Remove highlight from all options
// //             queryTypeDivs.forEach(d => d.classList.remove("selected"));

// //             // Highlight the clicked option
// //             this.classList.add("selected");

// //             // Reduce opacity for all panels
// //             Object.values(queryPanels).forEach(panel => panel.classList.remove("active"));

// //             // Increase opacity for the relevant panel
// //             if (queryPanels[this.id]) {
// //                 queryPanels[this.id].classList.add("active");
// //             }
// //         });
// //     });

// //     // Gather input data and send to backend
// //     const submitQuery = document.getElementById("submitQuery");
// //     submitQuery.addEventListener("click", function () {
// //         const startDate = document.getElementById("startDateInput").value;
// //         const endDate = document.getElementById("endDateInput").value;
// //         const startTime = document.getElementById("startTimeInput").value;
// //         const endTime = document.getElementById("endTimeInput").value;

// //         const queryData = {
// //             startDate,
// //             endDate,
// //             startTime,
// //             endTime
// //         };

// //         console.log("Query Data:", queryData); // For debugging

// //         // Send data to Flask backend
// //         fetch("/search", {
// //             method: "POST",
// //             headers: {
// //                 "Content-Type": "application/json"
// //             },
// //             body: JSON.stringify(queryData)
// //         })
// //         .then(response => response.json())
// //         .then(data => {
// //             console.log("Search Results:", data);
// //             // Display results in the queryResultPanel
// //             const resultPanel = document.getElementById("queryResultPanel");
// //             resultPanel.innerHTML = JSON.stringify(data, null, 2); // Format results
// //         })
// //         .catch(error => console.error("Error:", error));
// //     });
// // });
// document.addEventListener("DOMContentLoaded", function () {
//     const queryTypeDivs = document.querySelectorAll("#queryType > div");
//     const anomalyDivs = document.querySelectorAll("#queryParameters_anomaly > div");
//     const queryPanels = {
//         anomalySearch: document.getElementById("queryParameters_anomaly")
//     };

//     // Initially disable the queryParameters_anomaly div
//     const anomalyPanel = document.getElementById("queryParameters_anomaly");
//     anomalyPanel.classList.add("disabled");

//     // Event listener for queryType divs
//     queryTypeDivs.forEach(div => {
//         div.addEventListener("click", function () {
//             // Remove highlight from all options
//             queryTypeDivs.forEach(d => d.classList.remove("selected"));

//             // Highlight the clicked option
//             this.classList.add("selected");

//             // Reduce opacity for all panels
//             Object.values(queryPanels).forEach(panel => panel.classList.remove("active"));

//             // Enable anomaly panel if "Search for Anomalies" is clicked
//             if (this.id === "anomalySearch") {
//                 anomalyPanel.classList.remove("disabled");
//                 queryPanels[this.id].classList.add("active");
//             } else {
//                 anomalyPanel.classList.add("disabled");
//             }
//         });
//     });

//     // Event listener for anomaly divs (allow only one selection)
//     anomalyDivs.forEach(div => {
//         div.addEventListener("click", function () {
//             if (!anomalyPanel.classList.contains("disabled")) {
//                 // Deselect all other anomaly divs
//                 anomalyDivs.forEach(d => d.classList.remove("selected"));

//                 // Select the clicked anomaly div
//                 this.classList.add("selected");
//             }
//         });
//     });

//     // Gather input data and send to backend
//     const submitQuery = document.getElementById("submitQuery");
//     submitQuery.addEventListener("click", function () {
//         const selectedAnomaly = document.querySelector("#queryParameters_anomaly > div.selected");
//         const queryData = {
//             anomaly: selectedAnomaly ? selectedAnomaly.id : null
//         };

//         console.log("Query Data:", queryData); // For debugging

//         // Send data to Flask backend
//         fetch("http://127.0.0.1:5000/search", {
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
    const queryTypeDivs = document.querySelectorAll("#queryType > div");
    const anomalyDivs = document.querySelectorAll("#queryParameters_anomaly > div");
    const queryPanels = {
        anomalySearch: document.getElementById("queryParameters_anomaly")
    };

    const anomalyPanel = document.getElementById("queryParameters_anomaly");
    anomalyPanel.classList.add("disabled");

    queryTypeDivs.forEach(div => {
        div.addEventListener("click", function () {
            queryTypeDivs.forEach(d => d.classList.remove("selected"));
            this.classList.add("selected");

            Object.values(queryPanels).forEach(panel => panel.classList.remove("active"));

            if (this.id === "anomalySearch") {
                anomalyPanel.classList.remove("disabled");
                queryPanels[this.id].classList.add("active");
            } else {
                anomalyPanel.classList.add("disabled");
            }
        });
    });

    anomalyDivs.forEach(div => {
        div.addEventListener("click", function () {
            if (!anomalyPanel.classList.contains("disabled")) {
                anomalyDivs.forEach(d => d.classList.remove("selected"));
                this.classList.add("selected");
            }
        });
    });

    const submitQuery = document.getElementById("submitQuery");
    submitQuery.addEventListener("click", function () {
        const selectedAnomaly = document.querySelector("#queryParameters_anomaly > div.selected");
        const queryData = {
            anomaly: selectedAnomaly ? selectedAnomaly.id : null
        };

        if (!queryData.anomaly) {
            alert("Please select an anomaly condition before submitting.");
            return;
        }

        console.log("Query Data:", queryData);

        fetch("http://127.0.0.1:5000/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(queryData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Search Results:", data);
            displayResults(data); // Call the function to display results
        })
        .catch(error => console.error("Error:", error));
    });

    function displayResults(data) {
        const resultPanel = document.getElementById("queryResultPanel");
        resultPanel.innerHTML = ""; // Clear previous results
    
        if (data.length === 0) {
            resultPanel.innerHTML = "<p>No results found.</p>";
            return;
        }
    
        // Create a table
        const table = document.createElement("table");
        table.classList.add("result-table");
    
        // Create table header
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        Object.keys(data[0]).forEach(key => {
            const th = document.createElement("th");
            th.textContent = key;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
    
        // Create table body
        const tbody = document.createElement("tbody");
        data.forEach(row => {
            const tr = document.createElement("tr");
            Object.values(row).forEach(value => {
                const td = document.createElement("td");
                td.textContent = value;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
    
        // Append the table directly to the queryResultPanel
        resultPanel.appendChild(table);
    }
});