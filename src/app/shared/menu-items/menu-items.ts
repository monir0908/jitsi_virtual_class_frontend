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
        permission: 'Can See Dashboard'
      },


    ]
  },
  {
    label: 'Virtual Class',
    permission: 'Can Start Virtual Class,Can Join Virtual Class',
    main: [

      {
        state: 'host-vclass',
        name: 'Start Virutal Class',
        type: 'link',
        icon: 'icofont-host-vclass',
        permission: 'Can Start Virtual Class'
      },
      {
        state: 'participant-vclass',
        name: 'Join Virtual Class',
        type: 'link',
        icon: 'icofont-host-vclass',
        permission: 'Can Join Virtual Class'
      },


    ]
  },
  {
    label: 'Virtual Class History',
    permission: 'Can See Host Call History',
    main: [

      {
        state: 'vclass-history-host',
        name: 'Host Call History',
        type: 'link',
        icon: 'icofont-host-vclass-history',
        permission: 'Can See Host Call History'
      },      
      {
        state: 'vclass-history-host-individual',
        name: 'My Call History',
        type: 'link',
        icon: 'icofont-individual-host-vclass-history',
        permission: 'Can See Own Call History'
      },


    ]
  },
  {
    label: 'Master Settings',
    permission: 'Can Merge Host & Participant',
    main: [

      {
        state: 'project',
        name: 'Create Project',
        type: 'link',
        icon: 'icofont-project',
        permission: 'Can Create Project'
      },
      {
        state: 'batch',
        name: 'Create Batch',
        type: 'link',
        icon: 'icofont-batch',
        permission: 'Can Create Batch'
      },
      {
        state: 'project-batch',
        name: 'Merge Project & Batch',
        type: 'link',
        icon: 'icofont-project-batch',
        permission: 'Can Merge Project & Batch'
      },
      {
        state: 'project-batch-host',
        name: 'Merge Project Batch & Host',
        type: 'link',
        icon: 'icofont-project-batch-host',
        permission: 'Can Merge Project Batch & Host'
      },
      {
        state: 'project-batch-host-participant',
        name: 'Merge Host & Participant',
        type: 'link',
        icon: 'icofont-project-batch-host-participant',
        permission: 'Can Merge Host & Participant'
      },
    ]
  },
  {
    label: 'User Management',
    permission: 'Can Create Head Role,Can See User List',
    main: [
      {
        state: 'user-create',
        name: 'Create User',
        type: 'link',
        icon: 'icofont-project',
        permission: 'Can Create User'
      },
      {
        state: 'user',
        name: 'User List',
        type: 'link',
        icon: 'icofont-project',
        permission: 'Can See User List'
      }, 
  
    ]
  },     
  {
    label: 'Role Settings',
    permission: 'Can Create Head Role',
    main: [
      {
        state: 'head-role-create',
        name: 'Create Head Role',
        type: 'link',
        icon: 'icofont-project',
        permission: 'Can Create Head Role'
      },      
      {
        state: 'role-create',
        name: 'Create Role',
        type: 'link',
        icon: 'icofont-project',
        permission: 'Can Create Role'
      },
      {
        state: 'merge-role-and-head-role',
        name: 'Merge Head Role & Role',
        type: 'link',
        icon: 'icofont-project',
        permission: 'Can Merge Head Role & Roles'
      },
      
  ]
  }
  
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
