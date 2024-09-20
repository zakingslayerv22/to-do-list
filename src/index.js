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

readBook.updateProject(projectsArray[0], projectsArray[1])

// readBook.delete(projectsArray[0])

const projectsContainer = document.querySelector(".projects-container");
const tasksContainer = document.querySelector(".tasks-container");

function callHelperFunctions() {
    renderProjects();
    editTasks();
    deleteTasks();
    editProjects();
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

renderTasks(project2);

function handleProjectClicks(event, callback) {
    tasksContainer.textContent = "";

    const selectedIndex = event.target.dataset.index;

    const selectedProject = projectsArray[selectedIndex];
    if (!selectedProject) return;

    renderTasks(selectedProject);

    callback()
}

const projectDiv = document.querySelectorAll(".project-div");

projectDiv.forEach(project => {
    project.addEventListener("click", function(event){
        handleProjectClicks(event, function() {
            editTasks()
            deleteTasks()
        });
    });
});

window.addEventListener("load", () => {
    editTasks();
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
            editTasksButtonContainer.style.display = "";
            newTaskButtonsContainer.style.display = "none";
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
            
            callHelperFunctions()
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

const newTaskButton = document.querySelector("#new-task-button");
const newTasksConfirmButton = document.querySelector("#newTaskConfirmBtn");
const newTasksCancelButton = document.querySelector("#newTaskCancelBtn");



function handleCreateTasks(event) {
    newTasksConfirmButton.value = "thisIsForNewTasks";
    
    newTaskButtonsContainer.style.display = "";
    editTasksButtonContainer.style.display = "none";


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

const deleteDialog = document.querySelector("#deleteDialog")
const deleteTasksConfirmButton = document.querySelector("#deleteTasksConfirmBtn");
const deleteTasksCancelButton = document.querySelector("#deleteTasksCancelBtn");  


function deleteTasks() {
    const dialogTitle = document.querySelector(".delete-dialog-title");
    const deleteTasksButtons = document.querySelectorAll(".delete-task-button");

    deleteTasksConfirmButton.value = "userWantsToDelete";
    console.log(deleteTasksButtons);

    deleteTasksButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            deleteDialog.showModal();

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
    })
}

setupEventListenersForDeleteTasks();
deleteTasks();


//Projects

const projectsDialog = document.querySelector("#projectsDialog")

const projectTitleField = document.querySelector(".project-title");
const projectColorField = document.querySelector("#color");

const editProjectButtonContainer = document.querySelector(".edit-project-buttons");
const newProjectButtonsContainer = document.querySelector(".new-project-buttons");

const editProjectsConfirmButton = document.querySelector("#editProjectConfirmBtn");
const editProjectsCancelButton = document.querySelector("#editProjectCancelBtn");  
function editProjects() {
    const editProjectsButton = document.querySelectorAll(".edit-project-button");
    editProjectsConfirmButton.value = "thereIsUserInput";
    
    editProjectsButton.forEach((button) => {

        button.addEventListener(("click"), (event) => {
            editProjectButtonContainer.style.display = "";
            newProjectButtonsContainer.style.display = "none";
            
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

editProjects();