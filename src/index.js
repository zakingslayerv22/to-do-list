import "./index.css";

import { projectsArray, Project } from "./projects-module/project.module";
import { Task } from "./tasks-module/tasks.module";


const project2 = new Project("Project2", "green", [{title: "Learn baking", description: "Learn how to bake bread and biscuits", deadline: "2025-02-09", priority: "medium", status: "completed"}]);
const readBook = new Task ("Read Book", "Description of Book to be read", "2015-02-01", "high", "completed");


project2.add();
readBook.add(projectsArray[0])
