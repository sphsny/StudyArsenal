$(document).ready(function() {
    // load events from local storage
    loadEvents();

    // add event
    $("#add-event").click(function() {
        let eventName = $("#event-name").val(); // determine eventName var
        let eventDate = $("#event-date").val(); // determine eventDate var

        if (eventName && eventDate) { // if both name and date are chosen allow to save the data
            let events = JSON.parse(localStorage.getItem("events")) || [];
            events.push({ name: eventName, date: eventDate }); // push the data into the json array
            localStorage.setItem("events", JSON.stringify(events)); // json stringify the array data into local storage
            $("#event-name").val(""); // clear input
            $("#event-date").val(""); // clear input
            loadEvents(); // refresh event loading
        } else {
            alert("Please enter an event name and date."); // prompt the user to select both values
        }
    });

    // load events and display them
    function loadEvents() {
        let events = JSON.parse(localStorage.getItem("events")) || [];
        let today = new Date();
        $("#event-list").empty();

        events.forEach((event, index) => {
            let eventDate = new Date(event.date);
            let timeDiff = eventDate - today;
            let daysUntil = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            let row = `
                <tr>
                    <td>${event.name}</td>
                    <td>${daysUntil} days</td>
                    <td><button class="delete-event" data-index="${index}">Delete</button></td>
                </tr>
            `;

            $("#event-list").append(row);
        });

        // delete event
        $(".delete-event").click(function() {
            let index = $(this).data("index");
            let events = JSON.parse(localStorage.getItem("events")) || [];
            events.splice(index, 1);
            localStorage.setItem("events", JSON.stringify(events));
            loadEvents();
        });
    }
});
