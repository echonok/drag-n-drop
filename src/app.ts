interface Draggable {
  dragStartHandler(event: DragEvent): void;

  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;

  dropHandler(event: DragEvent): void;

  dragLeaveHandler(event: DragEvent): void;
}

enum EProjectType {
  ACTIVE = 'active',
  FINISHED = 'finished',
}

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenersFn: Listener<T>) {
    this.listeners.push(listenersFn);
  }

}

class ProjectState extends State<Project> {

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
    this.listeners.forEach((listenerFn) => listenerFn(this._projects.slice()));
  }
}

const projectState = ProjectState.getInstance();

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public numOfPeople: number,
    public projectType: EProjectType,
  ) {
  }
}

interface IProject {
  id?: string;
  title: string;
  description: string;
  numOfPeople: number;
}

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

const validate = (validatableInput: Validatable) => {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length > validatableInput.minLength;
  }
  if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length < validatableInput.maxLength;
  }
  if (validatableInput.min != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value > validatableInput.min;
  }
  if (validatableInput.max != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value < validatableInput.max;
  }
  return isValid;
}


const AutoBind = (_: any, _2: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      return originalMethod.bind(this);
    }
  }
  return adjustedDescriptor;
}

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElement: string,
    public insertAtStart: boolean,
    newElementId?: string,
  ) {
    this.templateElement = <HTMLTemplateElement>document.getElementById(templateId)!;
    this.hostElement = <T>document.getElementById(hostElement)!;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = <U>importedNode.firstElementChild;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attach(this.insertAtStart)
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element)
  }

  abstract configure(): void;

  abstract renderContent(): void;
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input')
    this.titleInputElement = <HTMLInputElement>this.element.querySelector('#title')!;
    this.descriptionInputElement = <HTMLInputElement>this.element.querySelector('#description')!;
    this.peopleInputElement = <HTMLInputElement>this.element.querySelector('#people')!;
    this.configure();
  }

  public configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDesc = this.descriptionInputElement.value;
    const enteredPeople = +this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    }

    const descValidatable: Validatable = {
      value: enteredDesc,
      required: true,
      minLength: 5,
    }

    const peopleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 1,
      max: 100,
    }

    if (
      !validate(titleValidatable) || !validate(descValidatable) || !validate(peopleValidatable)
    ) {
      alert('Invalid input, try again');
      return;
    } else {
      return [enteredTitle, enteredDesc, +enteredPeople]
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, numOfPeople] = userInput;
      projectState.addProject(title, description, numOfPeople);
      console.log({ title, description, numOfPeople });
      this.clearInputs();
    }
  }

  renderContent() {
  }

}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {

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
    console.log({ event });
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

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignProjects: Project[];

  constructor(
    private _type: EProjectType
  ) {
    super('project-list', 'app', false, `${_type}-projects`);
    this.assignProjects = [];

    projectState.addListener((projects: Project[]) => {
      this.assignProjects = projects.filter((project) => project.projectType === this._type);
      this.renderProjects();
    })

    this.renderContent();
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

  configure() {
  }

}

const projectInput = new ProjectInput();
const projectListActive = new ProjectList(EProjectType.ACTIVE);
const projectListFinished = new ProjectList(EProjectType.FINISHED);
