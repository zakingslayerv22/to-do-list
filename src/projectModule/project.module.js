export const projectsArray = [];

function createProject (name, color, initialTasks = []) {
    return {name, color, tasks: [...initialTasks]};
}


const pushProjects = (projectObject) => {
    projectsArray.push(projectObject);
}


const project1 = createProject("Project1", "red", [{taskName: "Task 1", taskDate: "2025-02-03", priority: "high"}]);

pushProjects(project1)

console.log(projectsArray );


