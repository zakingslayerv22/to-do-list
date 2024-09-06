import "./index.css";

import { projectsArray, Project } from "./projects-module/project.module";
import { Task } from "./tasks-module/tasks.module";


const project2 = new Project("Project Two", "green", []);

const readBook = new Task ("Read Alice in Wonderland", "Complete the target of 20 pages", "2015-02-01", "high", "completed");
const learnBaking = new Task("Learn baking", "Learn how to bake bread and biscuits", "2025-02-09", "medium", "completed")

const workOut = new Task ("Sit ups", "Do 10 sit-ups and 10 push ups", "2023-02-01", "high", "pending");


project2.add();
readBook.add(projectsArray[0]);
learnBaking.add(projectsArray[0]);
workOut.add(projectsArray[1])

const projectsContainer = document.querySelector(".projects-container");
const tasksContainer = document.querySelector(".tasks-container");

function renderProjects() {
    projectsArray.forEach((project, projectIndex) => {
        const projectElement = document.createElement("div");
        projectElement.textContent = `${project.title} (${project.tasks.length})`;
        projectElement.classList.add("project-div");
        projectElement.dataset.index = projectIndex;

        projectsContainer.appendChild(projectElement);
    });
}


renderProjects();

function renderTasks(projectObject) {
    tasksContainer.textContent = "";

    const projectIndex = projectsArray.indexOf(projectObject)

    projectObject.tasks.forEach((task, taskIndex) => {

        const editButton = document.createElement("button");
        editButton.classList.add("edit-task-button");
        editButton.textContent = "Edit";
        editButton.dataset.project = projectIndex;
        editButton.dataset.task = taskIndex;
        

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-task-button");
        deleteButton.textContent = "Delete";
        deleteButton.dataset.project = projectIndex;
        deleteButton.dataset.task = taskIndex;
        

        const taskElement = document.createElement("div");

        for (const property in task) {
            if (Object.hasOwn(task, property)) {
                const taskPropertyElement = document.createElement("div");
                taskPropertyElement.classList.add(`${property}-div`);
                taskPropertyElement.textContent = task[property];
                taskElement.appendChild(taskPropertyElement);
            }
        }

        tasksContainer.append(editButton, deleteButton, taskElement);
    });
}

renderTasks(project2);

function handleProjectClicks(event, callback) {
    tasksContainer.textContent = "";

    const selectedIndex = event.target.dataset.index;

    const selectedProject = projectsArray[selectedIndex];
    if (!selectedProject) return;

    renderTasks(selectedProject);

    callback()
}

projectsContainer.addEventListener("click", function(event){
    handleProjectClicks(event, function() {
        editTasks()
    });
});

window.addEventListener("load", () => {
    editTasks();
});

//for the tasks dialog

const tasksDialog = document.querySelector("#tasksDialog");
const confirmButton = document.querySelector("#confirmBtn");
const cancelButton = document.querySelector("#cancelBtn");

const titleField = document.querySelector("#title");
const descriptionField = document.querySelector("#description");
const deadlineField = document.querySelector("#deadline");
const priorityField = document.querySelector("#priority");
const statusField = document.querySelector('#status');

function editTasks() {
    const editTasksButton = document.querySelectorAll(".edit-task-button");

    
    editTasksButton.forEach((button) => {

        button.addEventListener(("click"), (event) => {
            tasksDialog.showModal();

            const projectIndex = event.target.getAttribute("data-project");
            const taskIndex = event.target.getAttribute("data-task");

            confirmButton.dataset.project = projectIndex;
            confirmButton.dataset.task = taskIndex;
            
            const selectedTask = projectsArray[projectIndex].tasks[taskIndex];

            //populate the modal form
            titleField.value = selectedTask.title;
            descriptionField.value = selectedTask.description;
            deadlineField.value = selectedTask.deadline;
            priorityField.value = selectedTask.priority;
            statusField.value = selectedTask.status;
        });



        tasksDialog.addEventListener("close", () => {
    
                const projectIndex = confirmButton.getAttribute("data-project");
                const taskIndex = confirmButton.getAttribute("data-task");

                const selectedTask = projectsArray[projectIndex].tasks[taskIndex];
                console.log(selectedTask);

                selectedTask.updateTitle(titleField.value);
                selectedTask.updateDescription(descriptionField.value);
                selectedTask.updateDeadline(deadlineField.value);
                selectedTask.updatePriority(priorityField.value);
                selectedTask.updateStatus(statusField.value);


                console.log(editTasksButton)
            
        });


    });
}

editTasks()



