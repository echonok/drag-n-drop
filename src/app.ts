class ProjectState {
  private listeners: any[] = [];
  private _projects: IProject[] = [];
  private static instance: ProjectState;

  private constructor() {
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenersFn: Function) {
    this.listeners.push(listenersFn);
  }

  addProject(project: IProject) {
    const newProject: IProject = {
      id: Math.random().toString(),
      ...project
    }
    this._projects.push(newProject);
    this.listeners.forEach((listenerFn) => listenerFn(this._projects.slice()));
  }
}

const projectState = ProjectState.getInstance();

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

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!;
    this.hostElement = <HTMLDivElement>document.getElementById('app')!;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = <HTMLFormElement>importedNode.firstElementChild;
    this.element.id = 'user-input';

    this.titleInputElement = <HTMLInputElement>this.element.querySelector('#title')!;
    this.descriptionInputElement = <HTMLInputElement>this.element.querySelector('#description')!;
    this.peopleInputElement = <HTMLInputElement>this.element.querySelector('#people')!;

    this.configure();
    this.attach();
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element)
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
      min: 5,
      max: 10,
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
      projectState.addProject({ title, description, numOfPeople });
      console.log({ title, description, numOfPeople });
      this.clearInputs();
    }
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }
}

class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignProjects: IProject[];

  constructor(
    private _type: 'active' | 'finished'
  ) {
    this.templateElement = <HTMLTemplateElement>document.getElementById('project-list')!;
    this.hostElement = <HTMLDivElement>document.getElementById('app')!;
    this.assignProjects = [];

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = <HTMLElement>importedNode.firstElementChild;
    this.element.id = `${this._type}-projects`;

    projectState.addListener((projects: IProject[]) => {
      this.assignProjects = projects;
      this.renderProjects();
    })

    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = <HTMLUListElement>document.getElementById(`${this._type}-project-list`)!;
    this.assignProjects.forEach((project) => {
      const listItem = document.createElement('li');
      listItem.textContent = project.title;
      listEl.appendChild(listItem);
    })
  }

  private renderContent() {
    this.element.querySelector('ul')!.id = `${this._type}-project-list`;
    this.element.querySelector('h2')!.textContent = this._type.toUpperCase() + ' PROJECTS';
  }

  private attach() {
    this.hostElement.insertAdjacentElement('beforeend', this.element)
  }
}

const projectInput = new ProjectInput();
const projectListActive = new ProjectList('active');
const projectListFinished = new ProjectList('finished');
