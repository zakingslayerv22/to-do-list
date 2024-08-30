

import { projectsArray } from "../projects-module/project.module";


export function createTask(title, description, deadline, priority, status) {
    return {title, description, deadline, priority, status}
}

const task1 = createTask("Read Book", "Description of Book to be read", "2015-02-01", "high", "completed");


export const addTask = (taskObject, projectObject) => {
    projectObject.tasks.push(taskObject)
}

addTask(task1, projectsArray[0]);


console.log(projectsArray)

// addTask()
