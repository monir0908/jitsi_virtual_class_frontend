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
        icon: 'icofont-dashboard',
        permission: 'Admin,Superuser,Host'
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
        icon: 'icofont-host-vclass',
        permission: 'Host'
      },
      {
        state: 'participant-vclass',
        name: 'Join Virtual Class',
        type: 'link',
        icon: 'icofont-host-vclass',
        permission: 'Participant'
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
        icon: 'icofont-host-vclass-history',
        permission: 'Admin,Superuser'
      },      
      {
        state: 'vclass-history-host-individual',
        name: 'My Call History',
        type: 'link',
        icon: 'icofont-individual-host-vclass-histor',
        permission: 'Host'
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
        icon: 'icofont-project',
        permission: 'Superuser'
      },
      {
        state: 'batch',
        name: 'Create Batch',
        type: 'link',
        icon: 'icofont-batch',
        permission: 'Superuser'
      },
      {
        state: 'project-batch',
        name: 'Merge Project & Batch',
        type: 'link',
        icon: 'icofont-project-batch',
        permission: 'Superuser'
      },
      {
        state: 'project-batch-host',
        name: 'Merge Project Host & Batch',
        type: 'link',
        icon: 'icofont-project-batch-host',
        permission: 'Superuser'
      },
      {
        state: 'project-batch-host-participant',
        name: 'Merge Host & Participant',
        type: 'link',
        icon: 'icofont-project-batch-host-participant',
        permission: 'Admin,Superuser'
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
