$(document).ready(function () {
    var timer = new easytimer.Timer(); // initialisation for timer from easytimer.js
    let sessionData = JSON.parse(localStorage.getItem("studySessions")) || {}; // sync session data with local storage

    // load subjects from json file
    $.getJSON("./data/subjects.json", function (data) {
        let $select = $("#inlineFormCustomSelect").empty(); // ensure no duplicates with empty
        data.subjects.forEach(subject => { // iterate through each value in json file
            $("<option>", { value: subject.id, text: subject.name }).appendTo($select);
        });
    });

    // from easytimer.js official documentation
    $('#chronoExample .startButton').off("click").on("click", function () {
        timer.start();
    });

    $('#chronoExample .pauseButton').off("click").on("click", function () {
        timer.pause();
    });

    $('#chronoExample .stopButton').off("click").on("click", function () { // prevent double session storing with off click
        let selectedSubject = $("#inlineFormCustomSelect option:selected").text(); // get selected subject
        let timeRecorded = timer.getTimeValues().toString(); // assign new var to store and convert the time recorded from timer to string
        let today = new Date().toLocaleDateString("en-GB");  // get todays date in british iso format
        let sessionLabel = saveSession(selectedSubject, today, timeRecorded); // save the session with the chosen parameters in local storage

        alert(`Session saved!\nSubject: ${selectedSubject}\nSession Name: ${sessionLabel}\nDate: ${today}\nTime: ${timeRecorded}`); // confirm that the session has been saved
    
        timer.stop(); // stop the timer

        $('#chronoExample .values').html("00:00:00"); // set the timer back to 00:00:00
    });

    $('#chronoExample .resetButton').off("click").on("click", function () {
        timer.stop();
        $('#chronoExample .values').html("00:00:00");
    });

    timer.addEventListener('secondsUpdated', function () {
        $('#chronoExample .values').html(timer.getTimeValues().toString());
    });

    timer.addEventListener('started', function () {
        $('#chronoExample .values').html(timer.getTimeValues().toString());
    });

    // manual time submitting function
    $('#submitManualTime').off("click").on("click", function () {
        let selectedSubject = $("#inlineFormCustomSelect option:selected").text(); // get selected subject
        let manualDate = $("#manualDate").val(); // assign variables for date and time input
        let manualTime = $("#manualTime").val().trim(); // trim blank space to ensure correctness

        // ensure user selects a subject
        if (!selectedSubject || selectedSubject === "Select a subject") {
            alert("Please select a subject.");
            return;
        }

        // ensure user selects a date
        if (!manualDate) {
            alert("Please select a date.");
            return;
        }

        // select user enters valid time format
        if (!isValidTimeFormat(manualTime)) {
            alert("Invalid time format. Please enter time as H:MM or HH:MM.");
            return;
        }

        // format the time from user input so it's uniform
        manualTime = formatTime(manualTime);

        let sessionLabel = saveSession(selectedSubject, manualDate, manualTime); // save the session in local storage

        // confirm that time has been added
        alert(`Manual time added!\nSubject: ${selectedSubject}\nSession Name: ${sessionLabel}\nDate: ${manualDate}\nTime: ${manualTime}`);

        // clear the manual time input field after the user has added their time
        $("#manualTime").val("");
    });

    // function to save the session with chosen parameters
    function saveSession(subject, date, timeRecorded) {
        let sessionData = JSON.parse(localStorage.getItem("studySessions")) || {}; // get sessions from local storage

        // check if sessiondata for subject already exists and if not, create a new array for it, e.g. use case: subject doesn't have any sessions yet
        if (!sessionData[subject]) {
            sessionData[subject] = [];
        }

        // add custom name and trim to remove blank spaces
        let customName = $("#customSessionName").val().trim();
        // assign each session a number that is one larger than the last one, so that we have session 1, session 2, etc.
        let sessionNumber = sessionData[subject].length + 1;
        // fall back if user didn't enter a custom name for the session to name it session x
        let sessionLabel = customName ? customName : `Session ${sessionNumber}`;

        // parameteres for the new recorded session
        let newSession = {
            subject: subject,
            session: sessionLabel,
            date: date,
            time: timeRecorded
        };

        // push the new session at the end of the array containing the subjects sessions
        sessionData[subject].push(newSession);
        localStorage.setItem("studySessions", JSON.stringify(sessionData)); // save in local storage
        return sessionLabel;
    }

    // time validation function to check what time is valid for input, minutes can only be 0-59 as then it becomes an hour
    function isValidTimeFormat(timeStr) {
        return /^([0-9]+):([0-5][0-9])$/.test(timeStr);
    }

    // format time so it's hours:minutes
    function formatTime(timeStr) {
        let [hours, minutes] = timeStr.split(":"); // extract the minutes and the hours by splitting them at the :
        hours = hours.padStart(2, "0"); // uniform the hours to have two digits if there is just a single value to ensure correct storaging
        minutes = minutes.padStart(2, "0"); // same with the minutes
        return `${hours}:${minutes}:00`; // append the hours:minute format so that they have the same uniform as the values taken from the timer
    }
});