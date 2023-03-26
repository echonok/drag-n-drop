namespace App {
  export enum EProjectType {
    ACTIVE = 'active',
    FINISHED = 'finished',
  }

  export class Project {
    constructor(
      public id: string,
      public title: string,
      public description: string,
      public numOfPeople: number,
      public projectType: EProjectType,
    ) {
    }
  }

}
