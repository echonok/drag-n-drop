import { Component } from './base.component.js';
import { EProjectType, Project } from '../models/project.model.js';
import { DragTarget } from '../models/drag-drop.interface.js';
import { AutoBind } from '../decorators/autobind.decorator.js';
import { projectState } from '../state/project.state.js';
import { ProjectItem } from './project-item.component.js';

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignProjects: Project[];

  constructor(
    private _type: EProjectType,
  ) {
    super('project-list', 'app', false, `${_type}-projects`);
    this.assignProjects = [];
    this.configure();
    this.renderContent();
  }

  @AutoBind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @AutoBind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(projectId, this._type !== EProjectType.ACTIVE ? EProjectType.FINISHED : EProjectType.ACTIVE);
  }

  @AutoBind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  private renderProjects() {
    const listEl = <HTMLUListElement>document.getElementById(`${this._type}-project-list`)!;
    listEl.innerHTML = '';
    this.assignProjects.forEach((project) => {
      new ProjectItem(this.element.querySelector('ul')!.id, project);
    })
  }

  renderContent() {
    this.element.querySelector('ul')!.id = `${this._type}-project-list`;
    this.element.querySelector('h2')!.textContent = this._type.toUpperCase() + ' PROJECTS';
  }

  @AutoBind
  configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);

    projectState.addListener((projects: Project[]) => {
      this.assignProjects = projects.filter((project) => project.projectType === this._type);
      this.renderProjects();
    })
  }

}
