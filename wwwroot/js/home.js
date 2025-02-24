    // retrieve todo tasks from local storage
    let todo = JSON.parse(localStorage.getItem("todo")) || [];
    
    // constants
    const todoInput = document.getElementById("todoInput");
    const todoList = document.getElementById("todoList");
    const addButton = document.getElementById("addButton");
    const deleteButton = document.getElementById("deleteButton");
    
    // initialisation
    $(document).ready(function () {
        addButton.addEventListener("click", addTask); // run addTask function on click
        displayTasks();
    });
    
    // functions
    function addTask() {
        const newTask = todoInput.value;
        if (newTask !== "") { // prevent empty input to be added as task
            todo.push({
                text: newTask, // push new task onto the array of todoList as text
                disabled: false, // disable checkbox by default
            });
            saveToLocalStorage();
            todoInput.value = "";
            displayTasks();
        }
    }
    
    function saveToLocalStorage() {
        localStorage.setItem("todo", JSON.stringify(todo));
    }
    
    function displayTasks() {
    todoList.innerHTML = "";
    todo.forEach((item, index) => {
        const p = document.createElement("p");
        p.innerHTML = `
            <div class="todo-container">
                <input type="checkbox" class="todo-checkbox" id="input-${index}" ${
            item.disabled ? "checked" : ""
            }>
                <p id="todo-${index}" class="${
            item.disabled ? "disabled" : ""
            }" onclick="editTask(${index})">${item.text}</p>
            </div>
        `;
        p.querySelector(".todo-checkbox").addEventListener("change", () =>
            toggleTask(index)
        );
            todoList.appendChild(p);
        });
        todoCount.textContent = todo.length;
    }

    function toggleTask(index) {
        todo[index].disabled = !todo[index].disabled;
        saveToLocalStorage();
        displayTasks();
    }