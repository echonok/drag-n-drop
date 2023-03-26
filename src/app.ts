import { ProjectInput } from './components/project-input.component.js';
import { ProjectList } from './components/project-list.component.js';
import { EProjectType } from './models/project.model.js';

new ProjectInput();
new ProjectList(EProjectType.ACTIVE);
new ProjectList(EProjectType.FINISHED);
