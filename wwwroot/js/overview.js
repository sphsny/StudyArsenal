$(document).ready(function () {
    let sessionData = JSON.parse(localStorage.getItem("studySessions")) || {}; // load stored session data
    let notesData = JSON.parse(localStorage.getItem("sessionNotes")) || {}; // load stored notes

    // load subjects from json file
    $.getJSON("./data/subjects.json", function (data) {
        let $subjectList = $("#subject-list"); // define subject list
        $subjectList.empty(); // clear existing subjects before rendering ensuring no duplicates

        data.subjects.forEach(subject => {
            let $subjectItem = $("<li>")
                .addClass("list-item subject-item")
                .text(subject.name)
                .data("subject", subject.name); // store subject name

            $subjectList.append($subjectItem);
        });
    });

    // load sessions of a subject on click
    $("#subject-list").on("click", ".subject-item", function () {
        let selectedSubject = $(this).data("subject");
        let $sessionList = $("#session-list");
        $sessionList.empty(); // clear existing session lists before rendering ensuring no duplicates

        // highlight the selected item
        $(".subject-item").removeClass("active"); // remove the "active" class from all items
        $(this).addClass("active"); // add active class to the clicked item

        if (sessionData[selectedSubject]) {
            sessionData[selectedSubject].forEach(session => {
                let $sessionItem = $("<li>")
                    .addClass("list-item session-item")
                    .data("subject", selectedSubject)
                    .data("session", session.session);
        
                let $sessionText = $("<span>").text(`${session.session} (${session.date})`); // show session name and date
                // add delete button to each session
                let $deleteButton = $("<button>")
                    .addClass("delete-session")
                    .text("❌")
                    .data("subject", selectedSubject)
                    .data("session", session.session);
        
                $sessionItem.append($sessionText, $deleteButton);
                $sessionList.append($sessionItem);
            });
        } else {
            $sessionList.append("<li class='list-item'>No sessions found</li>");
        }
    });

    // load session note on click
    $("#session-list").on("click", ".session-item", function () {
        let subject = $(this).data("subject");
        let session = $(this).data("session");
        let noteKey = `${subject}-${session}`; // unique key for each session note
        let savedNote = notesData[noteKey] || ""; // get saved note or empty field

        $("#note").val(savedNote).data("noteKey", noteKey); // save note and store its key

        $(".session-item").removeClass("active"); // remove active class from all
        $(this).addClass("active"); // add active class to clicked one
    });

    // save note as the user types
    $("#note").on("input", function () {
        let noteKey = $(this).data("noteKey");
        if (noteKey) {
            notesData[noteKey] = $(this).val(); // save note content
            localStorage.setItem("sessionNotes", JSON.stringify(notesData)); // store in local storage
        }
    });

    // delete session function
    $("#session-list").on("click", ".delete-session", function () {
        let subject = $(this).data("subject");
        let sessionName = $(this).data("session");

        // remove session from session data
        sessionData[subject] = sessionData[subject].filter(session => session.session !== sessionName);
        if (sessionData[subject].length === 0) delete sessionData[subject];

        // remove session note
        let noteKey = `${subject}-${sessionName}`;
        delete notesData[noteKey];

        // save changes
        localStorage.setItem("studySessions", JSON.stringify(sessionData));
        localStorage.setItem("sessionNotes", JSON.stringify(notesData));

        // re-render list after deleting so deleted list item is immediately removed
        $(this).closest("li").remove();
    });
    
    // https://stackoverflow.com/questions/61586888/javascript-export-local-storage
    $('#export-data').click(function () {
        // empty object for data to export (local storage)
        var dataToExport = {};

        // iterate through each key in local storage to exclude profilePicture key because it's a very long base64 string
        Object.keys(localStorage).forEach(key => {
            if (key !== 'profilePicture') { // check each key against profile picture key
                dataToExport[key] = localStorage.getItem(key); // add into dataToExport all other keys that are not profilePicture
            }
        });

        var jsonData = JSON.stringify(dataToExport, null, 4); // make json file readable to humans
    
        var blob = new Blob([jsonData], { type: "application/json" }); // mime type for local storage

        var url = window.URL.createObjectURL(blob);

        var fileName = 'data.json'; // name the file

        var $vLink = $('#exportLocalStorage'); // get anchor tag by id

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
                });
            }
            fileReader.readAsText(file); // file reader api
        }
    });
});
