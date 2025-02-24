// REFERENCES 
// to-do list inspired from: https://youtu.be/3OqWCGVaOkA
// edit name functionality inspired from: https://www.youtube.com/watch?v=6eFwtaZf6zc&ab_channel=TylerPotts

$(document).ready(function () {
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
});
