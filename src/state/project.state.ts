import { EProjectType, Project } from '../models/project.model';

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenersFn: Listener<T>) {
    this.listeners.push(listenersFn);
  }

}

export class ProjectState extends State<Project> {

  private _projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super()
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }


  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(Math.random().toString(), title, description, numOfPeople, EProjectType.ACTIVE)
    this._projects.push(newProject);
    this.updateListeners()
  }

  moveProject(projectId: string, newType: EProjectType) {
    const project = this._projects.find((project) => project.id === projectId);
    console.log({ project })
    if (project && project.projectType !== newType) {
      project.projectType = newType;
      this.updateListeners();
    }
  }

  private updateListeners() {
    this.listeners.forEach((listenerFn) => listenerFn(this._projects.slice()));
  }
}


export const projectState = ProjectState.getInstance();
