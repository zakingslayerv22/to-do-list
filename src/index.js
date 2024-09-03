import "./index.css";

import { projectsArray, Project } from "./projects-module/project.module";
import { Task } from "./tasks-module/tasks.module";


const project2 = new Project("Project2", "green", [{title: "Learn baking", description: "Learn how to bake bread and biscuits", deadline: "2025-02-09", priority: "medium", status: "completed"}]);
const readBook = new Task ("Read Book", "Description of Book to be read", "2015-02-01", "high", "completed");


project2.add();
readBook.add(projectsArray[0]);

const projectsContainer = document.querySelector(".projects-container");
const tasksContainer = document.querySelector(".tasks-container");

function renderProjects() {
    projectsArray.forEach((project, projectIndex) => {
        const projectElement = document.createElement("div");
        projectElement.textContent = `${project.title} (${project.tasks.length})`;
        projectElement.classList.add(`${project.title}-div`);
        projectElement.dataset.index = projectIndex;

        projectsContainer.appendChild(projectElement);
    });
}


renderProjects();

function renderTasks(projectObject) {
    tasksContainer.textContent = "";

    projectObject.tasks.forEach((task, taskIndex) => {

        const editButton = document.createElement("button");
        editButton.classList.add("task-edit-button");
        editButton.textContent = "Edit";
        editButton.dataset.index = taskIndex;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("task-delete-button");
        deleteButton.textContent = "Delete";
        deleteButton.dataset.index = taskIndex;

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

renderTasks(project2)

