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

readBook.updateProject(projectsArray[1], projectsArray[0])

// readBook.delete(projectsArray[0])

const projectsContainer = document.querySelector(".projects-container");
const tasksContainer = document.querySelector(".tasks-container");

function renderProjects() {
        projectsContainer.textContent = ""
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

            const projectIndex = event.target.getAttribute("data-project");
            const taskIndex = event.target.getAttribute("data-task");

            editTasksConfirmButton.dataset.project = projectIndex;
            editTasksConfirmButton.dataset.task = taskIndex;
            
            const selectedTask = projectsArray[projectIndex].tasks[taskIndex];

            createSelectOptions();
            //populate the modal form
            titleField.value = selectedTask.title;
            descriptionField.value = selectedTask.description;
            deadlineField.value = selectedTask.deadline;
            priorityField.value = selectedTask.priority;
            statusField.value = selectedTask.status;
            projectsField.value = projectIndex;

            console.log(projectIndex)
            console.log(projectsField.value)
           
        //    const optionsNodeList = document.querySelectorAll("option")

        //     console.log (optionsNodeList);

        //    optionsNodeList.forEach(option => {
        //     console.log(option)
        //    })
        });

    });
}



function setupEventListenersForEditTasks () {
    tasksDialog.addEventListener("close", () => {
        if (tasksDialog.returnValue === "thereIsUserInput"){
            const projectIndex = editTasksConfirmButton.getAttribute("data-project");
            const taskIndex = editTasksConfirmButton.getAttribute("data-task");

            const selectedTask = projectsArray[projectIndex].tasks[taskIndex];
            console.log(selectedTask);

            selectedTask.updateTitle(titleField.value);
            selectedTask.updateDescription(descriptionField.value);
            selectedTask.updateDeadline(deadlineField.value);
            selectedTask.updatePriority(priorityField.value);
            selectedTask.updateStatus(statusField.value);

            renderTasks(projectsArray[projectIndex])
            editTasks()
        }

       
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
            renderProjects();
            renderTasks(projectsArray[projectsField.value]);
            editTasks()
    
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


