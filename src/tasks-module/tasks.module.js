

import { projectsArray } from "../projects-module/project.module";

export class Task {
    constructor (title, description, deadline, priority, status) {
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.priority = priority;
        this.status = status;
    }

    add (projectObject) {
        projectObject.tasks.push(this)
    }

    delete (projectObject) {
        const index = projectObject.tasks.indexOf(this);
        if (index !== -1) {
            projectObject.tasks.splice(index, 1);
            console.log("Deleted");
        }
    }

    updateTitle(newTitle) {
        this.title = newTitle
    }

    updateDescription (newDescription) {
        this.description = newDescription;
    }

    updateDeadline (newDeadline) {
        this.deadline = newDeadline;
    }

    updatePriority (newPriority) {
        this.priority = newPriority;
    }

    updateStatus (newStatus) {
        this.status = newStatus;
    }
}

export function createTask(title, description, deadline, priority, status) {
    return {title, description, deadline, priority, status};
}

const task1 = new Task ("Read Book", "Description of Book to be read", "2015-02-01", "high", "completed");



task1.add(projectsArray[0]);

// task1.delete(projectsArray[0])

console.log(projectsArray)

// addTask()
