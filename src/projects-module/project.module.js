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


const project1 = new Project("Project One", "red", []);

project1.add()

console.log(projectsArray);


