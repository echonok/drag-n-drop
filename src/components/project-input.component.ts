import { Component } from './base.component';
import { Validatable, validate } from '../util/validation';
import { projectState } from '../state/project.state';
import { AutoBind } from '../decorators/autobind.decorator';

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
