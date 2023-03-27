import { Draggable } from '../models/drag-drop.interface';
import { Component } from './base.component';
import { Project } from '../models/project.model';
import { AutoBind } from '../decorators/autobind.decorator';

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {

  private project: Project;

  get persons() {
    if (this.project.numOfPeople === 1) {
      return '1 person assigned'
    } else {
      return `${this.project.numOfPeople} persons assigned`
    }
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }

  @AutoBind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  @AutoBind
  dragEndHandler(event: DragEvent): void {
    console.log({ event });
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragStartHandler);
  }

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons;
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}
