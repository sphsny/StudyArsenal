$(document).ready(function() {
    // load events from local storage
    loadEvents();

    // add event
    $("#addEvent").click(function() {
        let eventName = $("#eventName").val(); // determine eventName var
        let eventDate = $("#eventDate").val(); // determine eventDate var

        if (eventName && eventDate) { // if both name and date are chosen allow to save the data
            let events = JSON.parse(localStorage.getItem("events")) || [];
            events.push({ name: eventName, date: eventDate }); // push the data into the json array
            localStorage.setItem("events", JSON.stringify(events)); // json stringify the array data into local storage
            $("#eventName").val(""); // clear input
            $("#eventDate").val(""); // clear input
            loadEvents(); // refresh event loading
        } else {
            alert("Please enter an event name and date."); // prompt the user to select both values
        }
    });

    // load events and display them
    function loadEvents() {
        let events = JSON.parse(localStorage.getItem("events")) || [];
        let today = new Date();
        $("#eventList").empty();

        events.forEach((event, index) => {
            let eventDate = new Date(event.date);
            let timeDiff = eventDate - today;
            let daysUntil = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            let row = `
                <tr>
                    <td>${event.name}</td>
                    <td style="color:#473f61;font-weight:500;">${daysUntil} days</td>
                    <td><button class="deleteEvent" data-index="${index}">❌</button></td>
                </tr>
            `;

            $("#eventList").append(row);
        });

        // delete event
        $(".deleteEvent").click(function() {
            let index = $(this).data("index");
            let events = JSON.parse(localStorage.getItem("events")) || [];
            events.splice(index, 1);
            localStorage.setItem("events", JSON.stringify(events));
            loadEvents();
        });
    }
});
