import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  target?: boolean;
  name: string;
  type?: string;
  children?: ChildrenItems[];
}

export interface MainMenuItems {
  state: string;
  main_state?: string;
  target?: boolean;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

export interface Menu {
  label: string;
  main: MainMenuItems[];
}

const MENUITEMS = [
  {
    label: 'Dashboard',
    main: [

      {
        state: 'dashboard',
        name: 'Home',
        type: 'link',
        icon: 'icofont-dashboard'
      },


    ]
  },
  {
    label: 'Virtual Class',
    main: [

      {
        state: 'host-vclass',
        name: 'Start Virutal Class',
        type: 'link',
        icon: 'icofont-host-vclass'
      },
      {
        state: 'bparticipant-vclassatch',
        name: 'Join Virtual Class',
        type: 'link',
        icon: 'icofont-host-vclass'
      },


    ]
  },
  {
    label: 'Virtual Class History',
    main: [

      {
        state: 'vclass-history-host',
        name: 'Host Call History',
        type: 'link',
        icon: 'icofont-host-vclass-history'
      },
      {
        state: 'vclass-history-participant',
        name: 'Participant Call History',
        type: 'link',
        icon: 'icofont-participant-vclass-history'
      },
      {
        state: 'vclass-history-host-individual',
        name: 'My Call History (Host)',
        type: 'link',
        icon: 'icofont-individual-host-vclass-histor'
      },
      {
        state: 'vclass-history-participant-individual',
        name: 'My Call History (Participant)',
        type: 'link',
        icon: 'icofont-indicidual-participant-vclass-history'
      },


    ]
  },
  {
    label: 'Master Settings',
    main: [

      {
        state: 'project',
        name: 'Create Project',
        type: 'link',
        icon: 'icofont-project'
      },
      {
        state: 'batch',
        name: 'Create Batch',
        type: 'link',
        icon: 'icofont-batch'
      },
      {
        state: 'project-batch',
        name: 'Merge Project & Batch',
        type: 'link',
        icon: 'icofont-project-batch'
      },
      {
        state: 'project-batch-host',
        name: 'Merge Project Host & Batch',
        type: 'link',
        icon: 'icofont-project-batch-host'
      },
      {
        state: 'project-batch-host-participant',
        name: 'Merge Host & Participant',
        type: 'link',
        icon: 'icofont-project-batch-host-participant'
      },


    ]
  },
  
];

@Injectable()
export class MenuItems {
  private menu: Array<any> = MENUITEMS;
  getAll(): Menu[] {
    return this.menu;
  }

  refreshMenu(): void {
    this.menu = [];
    this.menu = MENUITEMS;
  }
  /*add(menu: Menu) {
    MENUITEMS.push(menu);
  }*/
}
