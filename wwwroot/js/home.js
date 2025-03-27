// REFERENCES 
// to-do list inspired from: https://youtu.be/3OqWCGVaOkA
// edit name functionality inspired from: https://www.youtube.com/watch?v=6eFwtaZf6zc&ab_channel=TylerPotts

$(document).ready(function () {
    // profile picture
    let savedImage = localStorage.getItem("profilePicture"); // load profile picture from local storage
    if (savedImage) {
        $("#profile-img").attr("src", savedImage); // if there is a saved image, set it as pfp
    }

    // click profile image
    $("#profile-img").click(function () {
        $("#profile-picture-input").click();
    });

    // update profile picture when user selects a file
    $("#profile-picture-input").on("change", function (event) {
        let file = event.target.files[0]; // limit selection to only one file
        if (file) { // check whether file was selected
            let reader = new FileReader();
            reader.onload = function (e) { // run function when picture is uploaded in mem
                let imageData = e.target.result; // use the base64 image as imageData
                $("#profile-img").attr("src", imageData); // update image, change src to new imageData var with base64 code
                localStorage.setItem("profilePicture", imageData); // save to local storage, as local storage can only store strings, we use base64
            };
            reader.readAsDataURL(file); // reads file as base64 which converts the image to a base64 encoded string
        }
    });

    // todo list
    let todoList = JSON.parse(localStorage.getItem("todo")) || []; // load todo list from local storage
    let username = localStorage.getItem("username") || ""; // load username from local storage

    $("#username").val(username); // set username as input value

    function saveTasks() {
        localStorage.setItem("todo", JSON.stringify(todoList)); // save tasks to local storage
    }

    function renderTasks() {
        $("#todoList").empty(); // clear existing tasks when rendering tasks as else there will be duplicates upon re-rendering
        todoList.forEach((task, index) => { // go throogh each task
            // html code in ``
            $("#todoList").append(`
                <div class="todo-container">
                    <span class="task-text ${task.done ? "completed" : ""}" data-index="${index}">
                        ${task.text}
                    </span>
                    <button class="delete-btn" data-index="${index}">❌</button>
                </div>
            `);
        });
    }

    $("#addButton").click(function () { // select button with addbutton id and write function if button is clicked
        let taskText = $("#todoInput").val().trim(); // trim empty space
        if (taskText === "") return; // prevent empty tasks

        todoList.push({ text: taskText, done: false }); // default variable set as false, push new todo onto list
        saveTasks();
        renderTasks();
        $("#todoInput").val(""); // clear input after submitting task
    });

    $("#todoList").on("click", ".task-text", function () { // what happens when clicking on text
        let index = $(this).data("index"); // assign each task own index
        todoList[index].done = !todoList[index].done; // toggle between done state 
        saveTasks();
        renderTasks();
    });

    $("#todoList").on("click", ".delete-btn", function () {
        let index = $(this).data("index");
        todoList.splice(index, 1);
        renderTasks();
        saveTasks();
    });

    $("#username").on("change", function () {
        localStorage.setItem("username", $(this).val()); // save username in local storage if changed
    });

    renderTasks(); // render tasks upon loading js script

    // timeTracked var that takes all the hours from local storage time...

    $("#deleteData").click(function () {
        localStorage.clear(); // clear local storage
        location.reload(); // reload page for immediate display
    });
});
