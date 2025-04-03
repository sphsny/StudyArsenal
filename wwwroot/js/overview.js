$(document).ready(function () {
    let sessionData = JSON.parse(localStorage.getItem("studySessions")) || {}; // load stored session data
    let notesData = JSON.parse(localStorage.getItem("sessionNotes")) || {}; // load stored notes

    // load subjects from json file
    $.getJSON("./data/subjects.json", function (data) {
        let $subjectList = $("#subject-list"); // define subject list
        $subjectList.empty(); // clear existing subjects before rendering ensuring no duplicates

        data.subjects.forEach(subject => { // iterate through subjects
            let $subjectItem = $("<li>") // let each subject be a list item
                .addClass("list-item subject-item") // add class
                .text(subject.name) // display name from json as text
                .data("subject", subject.name); // store subject name

            $subjectList.append($subjectItem); // display the list with the subject item
        });
    });

    // load sessions of a subject on click
    $("#subject-list").on("click", ".subject-item", function () {
        let selectedSubject = $(this).data("subject"); // if subject is selected
        let $sessionList = $("#session-list"); // define another list for sessions
        $sessionList.empty(); // clear existing session lists before rendering ensuring no duplicates

        // highlight the selected item
        $(".subject-item").removeClass("active"); // remove the "active" class from all items
        $(this).addClass("active"); // add active class to the clicked item

        if (sessionData[selectedSubject] && sessionData[selectedSubject].length > 0) { // check what subject is selected and check whether it contains sessions
            sessionData[selectedSubject].forEach(session => { // iterate through each session stored in subject
                let $sessionItem = $("<li>") // let each session item be a list item ... same procedure as for subject
                    .addClass("list-item session-item")
                    .data("subject", selectedSubject)
                    .data("session", session.session);
        
                let $sessionText = $("<span>").text(`${session.session} (${session.date})`); // show session name and date for each session as html span element
                // add delete button to each session
                let $deleteButton = $("<button>") // define delete button
                    .addClass("delete-session")
                    .text("❌")
                    .data("subject", selectedSubject) // get selected subject
                    .data("session", session.session); // get selected session
        
                $sessionItem.append($sessionText, $deleteButton); // append in the session list container
                $sessionList.append($sessionItem); // append behind the session list text
            });
        } else {
            $sessionList.append("<li class='list-item'>No sessions found</li>"); // if no sessions found, display this text
        }
    });

    // load session note on click
    $("#session-list").on("click", ".session-item", function () { // if in session list clicked on session item
        let subject = $(this).data("subject"); // get subject from clicked item
        let session = $(this).data("session"); // get session from clicked item
        let noteKey = `${subject}-${session}`; // get unique key for each session note
        let savedNote = notesData[noteKey] || ""; // get saved note or empty field

        $("#note").val(savedNote).data("noteKey", noteKey); // save note and store its key

        $(".session-item").removeClass("active"); // remove active class from all
        $(this).addClass("active"); // add active class to clicked one
    });

    // save note as the user types
    $("#note").on("input", function () {
        let noteKey = $(this).data("noteKey"); // define notekey data when any input on note field
        if (noteKey) { // if data in note
            notesData[noteKey] = $(this).val(); // save note content
            localStorage.setItem("sessionNotes", JSON.stringify(notesData)); // store in local storage
        }
    });

    // delete session function
    $("#session-list").on("click", ".delete-session", function () { // if clicked on button
        let subject = $(this).data("subject"); // define subject data from current selected (clicked) item
        let sessionName = $(this).data("session"); // define session data from current selected (clicked) item

        // remove session from session data with find index, which stops searching after the first match
        let index = sessionData[subject].findIndex(session => session.session === sessionName); // find index of session to delete by comparing session names, if found, return index of that session
        if (index !== -1) sessionData[subject].splice(index, 1); // if session found, delete session using splice at the just found index to avoid undefined places in the array

        // remove session note
        let noteKey = `${subject}-${sessionName}`; // get unique note key
        delete notesData[noteKey]; // delete the note key

        // save changes
        localStorage.setItem("studySessions", JSON.stringify(sessionData));
        localStorage.setItem("sessionNotes", JSON.stringify(notesData));

        // remove the li that is closest for immediate change
        $(this).closest("li").remove();
    });
    
    // https://stackoverflow.com/questions/61586888/javascript-export-local-storage
    $('#export-data').click(function () {
        // empty object for data to export (local storage)
        let dataToExport = {};

        // iterate through each key in local storage to exclude profilePicture key because it's a very long base64 string
        Object.keys(localStorage).forEach(key => {
            if (key !== 'profilePicture') { // check each key against profile picture key
                dataToExport[key] = localStorage.getItem(key); // add into dataToExport all other keys that are not profilePicture
            }
        });

        let jsonData = JSON.stringify(dataToExport, null, 4); // make json file readable to humans
    
        let blob = new Blob([jsonData], { type: "application/json" }); // mime type for local storage

        let url = window.URL.createObjectURL(blob);

        let fileName = 'data.json'; // name the file

        let $vLink = $('#exportLocalStorage'); // get anchor tag by id

        $vLink.attr('href', url);
        $vLink.attr('download', fileName);

        $vLink[0].click(); // click on the anchor link to start the download
    });

    $('#import-data').click(function () {
        $('#importFile').click();
    });

    // https://stackoverflow.com/questions/68129385/how-to-import-a-json-file-into-localstorage-with-a-button
    $('#importFile').change(function (event) {
        
        if (event.target.files.length > 0) { // ensure only one selected file
            let file = event.target.files[0];

            let fileReader = new FileReader(); // file reader api

            // function when file is uploaded
            fileReader.onload = function () {
                let parsedJSON = JSON.parse(fileReader.result); // parse json data
                // save json data one by one in key value pairs into local storage
                $.each(parsedJSON, function(key, value) {
                    localStorage.setItem(key, value);
                    location.reload(); // reload page https://stackoverflow.com/questions/5404839/how-do-i-refresh-a-page-using-javascript
                });
            }
            fileReader.readAsText(file); // file reader api
        }
    });
});
