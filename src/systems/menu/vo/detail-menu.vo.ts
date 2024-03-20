export interface DetailMenuVo {
  id: number;
  name: string;
  route?: string;
  icon?: string;
  sortNum: number;
  enable: boolean;
  type: number;
  permission: string;
  parentId?: number;
  children?: DetailMenuVo[];
}
