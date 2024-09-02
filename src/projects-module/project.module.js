export const projectsArray = [];


export class Project {
    constructor (title, color, initialTasks = []) {
        this.title = title;
        this.color = color;
        this.tasks = [...initialTasks];
    }

    add() {
        projectsArray.push(this);
    }

    delete() {
        const index = projectsArray.indexOf(this);

        if (index !== -1) {
            projectsArray.splice(index, 1);
        }
        
    }

    updateTitle(newTitle) {
        this.title = newTitle;
    }

    updateColor(newColor) {
        this.color = newColor;
    }
}


const project1 = new Project("Project1", "red", [{title: "Rehearse Guitar", description: "Practice the G Dom7 chord", deadline: "2025-02-03", priority: "high", status: "pending"}]);

project1.add()

console.log(projectsArray);


