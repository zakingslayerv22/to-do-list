

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

    updateProject (previousProjectObject, newProjectObject, ) {
        const index = previousProjectObject.tasks.indexOf(this);
        newProjectObject.tasks.unshift(previousProjectObject.tasks[index]);
        this.delete(previousProjectObject);
    }
}


const beginThesis = new Task ("Begin thesis", "Make further research on thesis topic", "2015-02-01", "high", "completed");



beginThesis.add(projectsArray[0]);

// task1.delete(projectsArray[0])

console.log(projectsArray)

// addTask()
