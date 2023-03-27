import { ProjectInput } from './components/project-input.component';
import { ProjectList } from './components/project-list.component';
import { EProjectType } from './models/project.model';

new ProjectInput();
new ProjectList(EProjectType.ACTIVE);
new ProjectList(EProjectType.FINISHED);
