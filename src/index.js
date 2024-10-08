import "./index.css";

import { projectsArray as initialProjectsArray, Project } from "./projects-module/project.module";
import { Task } from "./tasks-module/tasks.module";


const project2 = new Project("Project Two", "green", []);

const readBook = new Task ("Read Alice in Wonderland", "Complete the target of 20 pages", "2020-05-01", "high", "completed");
const learnBaking = new Task("Learn baking", "Learn how to bake bread and biscuits", "2024-02-09", "medium", "completed")

const workOut = new Task ("Sit ups", "Do 10 sit-ups and 10 push ups", "2023-02-01", "high", "pending");



project2.add();
readBook.add(initialProjectsArray[0]);
learnBaking.add(initialProjectsArray[0]);
workOut.add(initialProjectsArray[1])

readBook.updateProject(initialProjectsArray[0], initialProjectsArray[1])

// readBook.delete(projectsArray[0])

const projectsContainer = document.querySelector(".projects-container");
const tasksContainer = document.querySelector(".tasks-container");
const newTaskButton = document.querySelector("#new-task-button");

const projectsArray = fetchLocalStorageArrayOrDefault();

function isProjectArrayEmpty() {
    return projectsArray.length === 0;
}

function clearTasksContainer() {
    if (isProjectArrayEmpty()) {
        tasksContainer.textContent = "";
    } 
}

function hideOrShowButtonsDiv(divToHide, divToShow) {
    divToHide.style.display = "none";
    divToShow.style.display = "";
}

function handleNewTaskButton() {
    newTaskButton.disabled = isProjectArrayEmpty() ? true : false;
}

function sortTasksByDeadline(array) {
    array.forEach(element => {
        element.tasks.sort((a, b) => {
            return new Date(b.deadline) - new Date(a.deadline);
        });
    });
}

function updateLocalStorage() {
    localStorage.setItem('projectsArray', JSON.stringify(initialProjectsArray));
 } 

 function fetchLocalStorageArrayOrDefault() {
    const localStorageProjectsArray = JSON.parse(localStorage.getItem("projectsArray") || "[]");

    let finalProjectsArray = !localStorageProjectsArray.length ? initialProjectsArray : localStorageProjectsArray;

    return finalProjectsArray;
 }



function callHelperFunctions() {
    renderProjects();
    editTasks();
    deleteTasks();
    editProjects();
    deleteProjects();
    clearTasksContainer();
    handleNewTaskButton();

    handleProjectClicksAfterCrud()
    sortTasksByDeadline(projectsArray);
}

function renderProjects() {
        projectsContainer.textContent = ""
        projectsArray.forEach((project, projectIndex) => {
            
            const editButton = document.createElement("button");
            editButton.classList.add("edit-project-button");
            editButton.textContent = "Edit";
            editButton.dataset.projectIndex = projectIndex;
            

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-project-button");
            deleteButton.textContent = "Delete";
            deleteButton.dataset.projectIndex = projectIndex;


            const projectElement = document.createElement("div");
            projectElement.textContent = `${project.title} (${project.tasks.length})`;
            projectElement.classList.add("project-div");
            projectElement.dataset.index = projectIndex;

            projectsContainer.append(editButton, deleteButton, projectElement);
    });
}


renderProjects();

function renderTasks(projectObject) {
    tasksContainer.textContent = "";

    const oldProjectIndex = projectsArray.indexOf(projectObject)

    if (!projectObject.tasks.length) {
        console.log("No tasks to see here. Start by adding a new task!")
    }

    sortTasksByDeadline(projectsArray);
    
    projectObject.tasks.forEach((task, taskIndex) => {

        const editButton = document.createElement("button");
        editButton.classList.add("edit-task-button");
        editButton.textContent = "Edit";
        editButton.dataset.oldProject = oldProjectIndex;
        editButton.dataset.task = taskIndex;
        

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-task-button");
        deleteButton.textContent = "Delete";
        deleteButton.dataset.project = oldProjectIndex;
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


function handleProjectClicks(event, callback) {
    tasksContainer.textContent = "";

    const selectedIndex = event.target.dataset.index;

    const selectedProject = projectsArray[selectedIndex];
    if (!selectedProject) return;

    renderTasks(selectedProject);

    callback()
}

function handleProjectClicksAfterCrud() {
    const projectDiv = document.querySelectorAll(".project-div");

    projectDiv.forEach(project => {
        project.addEventListener("click", function(event){
            handleProjectClicks(event, function() {
                editTasks()
                deleteTasks()
            });
        });
    });
}
handleProjectClicksAfterCrud()


window.addEventListener("load", () => {
    renderTasks(project2);
    editTasks();
    deleteTasks();
});

//for the tasks dialog

const tasksDialog = document.querySelector("#tasksDialog");

const editTasksButtonContainer = document.querySelector(".edit-tasks-buttons")
const newTaskButtonsContainer = document.querySelector(".new-tasks-buttons");



const titleField = document.querySelector("#title");
const descriptionField = document.querySelector("#description");
const deadlineField = document.querySelector("#deadline");
const priorityField = document.querySelector("#priority");
const statusField = document.querySelector('#status');
const projectsField = document.querySelector("#projects");

const editTasksConfirmButton = document.querySelector("#confirmBtn");
const editTasksCancelButton = document.querySelector("#cancelBtn");  

function createSelectOptions() {
    projectsField.textContent = "";

    const defaultOption = document.createElement('option');
    //    let selectOption = ""; 
    
       defaultOption.textContent = "Select project";
       defaultOption.selected = true;
       defaultOption.disabled = true;
       defaultOption.hidden = true;
    
       projectsField.appendChild(defaultOption);

        let selectOption = "";

        projectsArray.forEach((project, projectIndex) => {
        selectOption = document.createElement("option");
        selectOption.textContent = project.title;
        selectOption.value = projectIndex;
        
        projectsField.appendChild(selectOption);
    
        // console.log(selectOption);
        
        });

    return {selectOption}
}

console.log(createSelectOptions());

function editTasks() {
    const editTasksButton = document.querySelectorAll(".edit-task-button");
    editTasksConfirmButton.value = "thereIsUserInput";
    
    editTasksButton.forEach((button) => {

        button.addEventListener(("click"), (event) => {
            
            hideOrShowButtonsDiv(newTaskButtonsContainer, editTasksButtonContainer)
            tasksDialog.showModal();

            const oldProjectIndex = event.target.getAttribute("data-old-project");
            const taskIndex = event.target.getAttribute("data-task");

            editTasksConfirmButton.dataset.project = oldProjectIndex;
            editTasksConfirmButton.dataset.task = taskIndex;
            
            const selectedTask = projectsArray[oldProjectIndex].tasks[taskIndex];

            createSelectOptions();
            //populate the modal form
            titleField.value = selectedTask.title;
            descriptionField.value = selectedTask.description;
            deadlineField.value = selectedTask.deadline;
            priorityField.value = selectedTask.priority;
            statusField.value = selectedTask.status;
            projectsField.value = oldProjectIndex;

            projectsField.addEventListener("change", () => {
                editTasksConfirmButton.dataset.newProject = projectsField.value;

            })

        });

    });
}



function setupEventListenersForEditTasks () {
    tasksDialog.addEventListener("close", () => {
        if (tasksDialog.returnValue === "thereIsUserInput"){
            const oldProjectIndex = editTasksConfirmButton.getAttribute("data-project");
            const taskIndex = editTasksConfirmButton.getAttribute("data-task");
            const newProjectIndex = editTasksConfirmButton.getAttribute("data-new-project");

            const selectedTask = projectsArray[oldProjectIndex].tasks[taskIndex];
            console.log(selectedTask);

            selectedTask.updateTitle(titleField.value);
            selectedTask.updateDescription(descriptionField.value);
            selectedTask.updateDeadline(deadlineField.value);
            selectedTask.updatePriority(priorityField.value);
            selectedTask.updateStatus(statusField.value);

            if (newProjectIndex) {
                selectedTask.updateProject(projectsArray[oldProjectIndex], projectsArray[newProjectIndex]);
                renderTasks(projectsArray[newProjectIndex])
            } else {
                renderTasks(projectsArray[oldProjectIndex])
            }
            
            callHelperFunctions();
            
        }

        editTasksConfirmButton.removeAttribute("data-new-project");
       
    });

    editTasksConfirmButton.addEventListener("click", (event) => {
        event.preventDefault;
        tasksDialog.close(editTasksConfirmButton.value);
    });

    editTasksCancelButton.addEventListener(("click"), () => {
        tasksDialog.returnValue = "cancel"
        tasksDialog.close();
    })

}

setupEventListenersForEditTasks()

editTasks();


const newTasksConfirmButton = document.querySelector("#newTaskConfirmBtn");
const newTasksCancelButton = document.querySelector("#newTaskCancelBtn");



function handleCreateTasks(event) {
    newTasksConfirmButton.value = "thisIsForNewTasks";
    
    hideOrShowButtonsDiv(editTasksButtonContainer, newTaskButtonsContainer);

    tasksDialog.showModal();


    //clear the modal form
    titleField.value = "";
    descriptionField.value = "";
    deadlineField.value = "";
    priorityField.value = "";
    statusField.value = "";
    projectsField.value = "";
    projectsField.textContent = "";


   // const projectsField = document.querySelector("#projects");

   const defaultOption = document.createElement('option');
//    let selectOption = ""; 

   defaultOption.textContent = "Select project";
   defaultOption.selected = true;
   defaultOption.disabled = true;
   defaultOption.hidden = true;

   projectsField.appendChild(defaultOption);

    createSelectOptions()


}



function setupEventListenersForNewTasks() {
    tasksDialog.addEventListener("close", () => {
        if (tasksDialog.returnValue === "thisIsForNewTasks") {
            const newTask = new Task (
                titleField.value, 
                descriptionField.value, 
                deadlineField.value, 
                priorityField.value, 
                statusField.value);

            console.log(projectsField.value);
    
            projectsArray[projectsField.value].tasks.unshift(newTask);
    
            console.log(projectsArray);
            renderTasks(projectsArray[projectsField.value]);

            callHelperFunctions()
    
            // tasksDialog.removeEventListener("close", closeTaskDialog);
        
        }
        
    });

    newTasksConfirmButton.addEventListener("click", (event) => {
        event.preventDefault();
        tasksDialog.close(newTasksConfirmButton.value);
    });
    
    
    newTasksCancelButton.addEventListener(("click"), () => {
        tasksDialog.returnValue = "cancel";
        tasksDialog.close();
    });
} 

setupEventListenersForNewTasks()

newTaskButton.addEventListener("click", handleCreateTasks);

//delete tasks

const deleteDialog = document.querySelector("#deleteDialog");
const deleteProjectsButtonsContainer = document.querySelector(".delete-projects-buttons");
const deleteTasksButtonsContainer = document.querySelector(".delete-tasks-buttons");

const deleteTasksConfirmButton = document.querySelector("#deleteTasksConfirmBtn");
const deleteTasksCancelButton = document.querySelector("#deleteTasksCancelBtn");  


function deleteTasks() {
    const dialogTitle = document.querySelector(".delete-dialog-title");
    const deleteTasksButtons = document.querySelectorAll(".delete-task-button");


    deleteTasksConfirmButton.value = "userWantsToDelete";


    deleteTasksButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            deleteDialog.showModal();

            hideOrShowButtonsDiv(deleteProjectsButtonsContainer, deleteTasksButtonsContainer);

            const projectIndex = event.target.getAttribute("data-project");
            const taskIndex = event.target.getAttribute("data-task");

            const projectObject = projectsArray[projectIndex]
            const selectedTask = projectsArray[projectIndex].tasks[taskIndex];

            dialogTitle.textContent = `Delete ${selectedTask.title} task from 
                                        ${projectObject.title} project? This 
                                        action cannot be undone.`


            deleteTasksConfirmButton.dataset.project = projectIndex;
            deleteTasksConfirmButton.dataset.task = taskIndex;

        });
    });
}

function setupEventListenersForDeleteTasks() {
    deleteDialog.addEventListener("close", () => {
        if (deleteDialog.returnValue === "userWantsToDelete"){
            const projectIndex = deleteTasksConfirmButton.getAttribute("data-project");
            const taskIndex = deleteTasksConfirmButton.getAttribute("data-task");

            const projectObject = projectsArray[projectIndex]
            const selectedTask = projectsArray[projectIndex].tasks[taskIndex];

            selectedTask.delete(projectObject);

            renderTasks(projectObject);

            callHelperFunctions();
            // console.log(projectDiv)
        }

       
    });

    deleteTasksConfirmButton.addEventListener("click", (event) => {
        event.preventDefault;
        deleteDialog.close(deleteTasksConfirmButton.value);
    });

    deleteTasksCancelButton.addEventListener(("click"), () => {
        deleteDialog.returnValue = "cancel"
        deleteDialog.close();
    });
}

deleteTasks();
setupEventListenersForDeleteTasks();




//Projects

const projectsDialog = document.querySelector("#projectsDialog")

const projectTitleField = document.querySelector(".project-title");
const projectColorField = document.querySelector("#color");

const editProjectsButtonContainer = document.querySelector(".edit-project-buttons");
const newProjectsButtonsContainer = document.querySelector(".new-project-buttons");

const editProjectsConfirmButton = document.querySelector("#editProjectConfirmBtn");
const editProjectsCancelButton = document.querySelector("#editProjectCancelBtn"); 

function editProjects() {
    const editProjectsButton = document.querySelectorAll(".edit-project-button");
    editProjectsConfirmButton.value = "thereIsUserInput";
    
    editProjectsButton.forEach((button) => {

        button.addEventListener(("click"), (event) => {

            hideOrShowButtonsDiv(newProjectsButtonsContainer, editProjectsButtonContainer);

            projectsDialog.showModal();

            const projectIndex = event.target.getAttribute("data-project-index");

            editProjectsConfirmButton.dataset.projectIndex = projectIndex;
            
            const selectedProject = projectsArray[projectIndex]

            //populate the modal form
            projectTitleField.value = selectedProject.title;
            projectColorField.value = selectedProject.color;

        });

    });
}

function setupEventListenersForEditProjects () {
    projectsDialog.addEventListener("close", () => {
        if (projectsDialog.returnValue === "thereIsUserInput"){
            const projectIndex = editProjectsConfirmButton.getAttribute("data-project-index");
            
            const selectedProject = projectsArray[projectIndex];

            console.log(selectedProject)

            selectedProject.updateTitle(projectTitleField.value);
            selectedProject.updateColor(projectColorField.value);

            callHelperFunctions();
        }

       
    });

    editProjectsConfirmButton.addEventListener("click", (event) => {
        event.preventDefault;
        projectsDialog.close(editProjectsConfirmButton.value);
        console.log(projectsArray);
    });

    editProjectsCancelButton.addEventListener(("click"), () => {
        projectsDialog.returnValue = "cancel"
        projectsDialog.close();
    })

}

setupEventListenersForEditProjects ()

editProjects()


const newProjectButton = document.querySelector("#new-project-button");
const newProjectsConfirmButton = document.querySelector("#newProjectConfirmBtn");
const newProjectsCancelButton = document.querySelector("#newProjectCancelBtn");

function handleCreateProjects() {
    newProjectsConfirmButton.value = "thisIsForNewProjects";
    
    hideOrShowButtonsDiv(editProjectsButtonContainer, newProjectsButtonsContainer);

    projectsDialog.showModal();

    //clear the modal form
    projectTitleField.value = "";
    projectColorField.value = "";

   const defaultOption = document.createElement('option');

   defaultOption.textContent = "Select Color";
   defaultOption.selected = true;
   defaultOption.disabled = true;
   defaultOption.hidden = true;

   projectColorField.appendChild(defaultOption);

}


function setupEventListenersForNewProjects() {
    projectsDialog.addEventListener("close", () => {
        if (projectsDialog.returnValue === "thisIsForNewProjects") {
            const newProject = new Project (
                projectTitleField.value, 
                projectColorField.value 
            );

            projectsArray.unshift(newProject);
    
            renderTasks(projectsArray[0]);
            // renderTasks(projectsArray[projectsArray.indexOf(newProject)]);
            callHelperFunctions()

        }
        
    });

    newProjectsConfirmButton.addEventListener("click", (event) => {
        event.preventDefault();
        projectsDialog.close(newProjectsConfirmButton.value);
    });
    
    
    newProjectsCancelButton.addEventListener(("click"), () => {
        projectsDialog.returnValue = "cancel";
        projectsDialog.close();
    });
} 

setupEventListenersForNewProjects()

newProjectButton.addEventListener("click", handleCreateProjects);


const deleteProjectsConfirmButton = document.querySelector("#deleteProjectsConfirmBtn");
const deleteProjectsCancelButton = document.querySelector("#deleteProjectsCancelBtn");

function deleteProjects() {
    const dialogTitle = document.querySelector(".delete-dialog-title");
    const deleteProjectsButtons = document.querySelectorAll(".delete-project-button");

    deleteProjectsConfirmButton.value = "userWantsToDeleteProject";
    // console.log(deleteTasksButtons);

    deleteProjectsButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            deleteDialog.showModal();

            hideOrShowButtonsDiv(deleteTasksButtonsContainer, deleteProjectsButtonsContainer);

            const projectIndex = event.target.getAttribute("data-project-index");

            const projectObject = projectsArray[projectIndex]

            dialogTitle.textContent = `Delete ${projectObject.title} project and all its tasks? This 
                                        action cannot be undone.`

            deleteProjectsConfirmButton.dataset.projectIndex = projectIndex;

        });
    });
}

function setupEventListenersForDeleteProjects() {
    deleteDialog.addEventListener("close", () => {
        if (deleteDialog.returnValue === "userWantsToDeleteProject"){
            const projectIndex = deleteProjectsConfirmButton.getAttribute("data-project-index");

            const projectObject = projectsArray[projectIndex];

            if ((projectsArray.length - projectIndex === 1)) {
                renderTasks(projectsArray[0]);
            } else {
                renderTasks(projectsArray[+projectIndex + 1])
            } 

            projectObject.delete();

            callHelperFunctions();
        }

    });

    deleteProjectsConfirmButton.addEventListener("click", (event) => {
        event.preventDefault;
        deleteDialog.close(deleteProjectsConfirmButton.value);
    });

    deleteProjectsCancelButton.addEventListener(("click"), () => {
        deleteDialog.returnValue = "cancelDelete"
        deleteDialog.close();
    });
}

setupEventListenersForDeleteProjects()

deleteProjects()

sortTasksByDeadline(projectsArray);

