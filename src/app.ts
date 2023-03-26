/// <reference path="models/drag-drop.interface.ts" />
/// <reference path="models/project.model.ts" />
/// <reference path="state/project.state.ts" />
/// <reference path="util/validation.ts" />
/// <reference path="decorators/autobind.decorator.ts" />
/// <reference path="components/base.component.ts" />
/// <reference path="components/project-input.component.ts" />
/// <reference path="components/project-list.component.ts" />
/// <reference path="components/project-item.component.ts" />

namespace App {

  new ProjectInput();
  new ProjectList(EProjectType.ACTIVE);
  new ProjectList(EProjectType.FINISHED);

}
