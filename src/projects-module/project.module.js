export const projectsArray = [];


export class Project {
    constructor (title, color, initialTasks = []) {
        this.title = title;
        this.color = color;
        this.tasks = [...initialTasks];
    }

    addProject() {
        projectsArray.push(this);
    }
}


const project1 = new Project("Project1", "red", [{title: "Rehearse Guitar", description: "Practice the G Dom7 chord", deadline: "2025-02-03", priority: "high", status: "pending"}]);

project1.addProject()

console.log(projectsArray);


