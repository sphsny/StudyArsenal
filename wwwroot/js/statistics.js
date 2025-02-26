$(document).ready(function () {
    let sessionData = JSON.parse(localStorage.getItem("studySessions")) || {}; // get local storage

    if (Object.keys(sessionData).length === 0) { // check if no study sessions are recorded and return a message if it's the case
        $("#chartContainer").html("<p style='text-align:center; font-size:18px; color:red;'>No study session data available.</p>");
        return;
    }

    // assign variables to be able to use chart.js library
    let subjects = Object.keys(sessionData); // get subjects from sessiondata and let them be the object keys
    let sessionLabels = []; // create array for the different sessions with their unique names
    let datasets = []; // create dataset to represent study times for the different sessions

    // loop through all subjects
    subjects.forEach(subject => {
        if (!Array.isArray(sessionData[subject])) {
            // skip wrongly formatted data to avoid errors
            return;
        }

        // loop through the sessions for a subject
        sessionData[subject].forEach(session => {
            let sessionLabel = session.session; // get the session name from local storage (name is saved as session)
            if (!sessionLabels.includes(sessionLabel)) {
                sessionLabels.push(sessionLabel); // ensure no duplicates in session names by pushing the name into a sessionlabels array
            }
        });
    });

    sessionLabels.forEach((sessionLabel, index) => { // loop through the sessions
        let sessionTimes = subjects.map(subject => { // loop through each subject
            let totalTime = sessionData[subject] // get the sessions for a subject
                .filter(s => s.session === sessionLabel) // check if there are sessions in a subject with the same name
                .reduce((sum, s) => sum + convertTimeToHours(s.time), 0); // convert the time from time string (timeRecorded from newSession) into hours by using our custom function, add time of sessions with same name in a subject together so they share a bar
            return totalTime; // return the total time for the session
        });

        // create dataset
        datasets.push({
            label: sessionLabel, // assign session name
            data: sessionTimes, // assign session time
            backgroundColor: getRandomColor(), // assign a random color for more aesthetic bar chart
        });
    });

    // chart initialisation from chart.js official documentation https://www.chartjs.org/docs/latest/charts/bar.html
    let ctx = document.getElementById("studyChart").getContext("2d"); // select studychart id to display the chart on the site from the html code, specify context as chart.js needs 2d graphics to be drawn
    // create the chart
    new Chart(ctx, {
        type: "bar", // display bars
        data: { // define what data to use
            labels: subjects,
            datasets: datasets
        },
        options: {
            indexAxis: 'y', // make bars horizontal
            plugins: {
                legend: { display: false } // hide legend
            },
            // allow for dynamic stretching and makes the chart looks better
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { 
                    stacked: true,
                    title: { display: true, text: "Hours Spent" }, // add label to the x axis
                },
                y: { 
                    stacked: true, // allow bar stacking for the different sesssions
                    title: { display: true, text: "Subjects" } // add label to the y axis
                }
            }
        }
    });

    function convertTimeToHours(timeStr) { // function to convert time to hours to display hour values
        let [hours, minutes, seconds] = timeStr.split(":").map(Number); // extract time from a string
        return hours + (minutes / 60) + (seconds / 3600); // convert time to hours
    }

    function getRandomColor() { // function to get random color
        return `hsl(${Math.random() * 360}, 70%, 60%)`; // generate num between 0 and 360, which is the rgb spectrum, then adjust saturation and brightness
    }
});