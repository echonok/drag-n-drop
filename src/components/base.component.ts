namespace App {
  export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
}
