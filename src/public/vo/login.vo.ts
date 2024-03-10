interface UserInfo {
  id: number;
  username: string;
  nickName: string;
  email: string;
  phone: string;
  avatar: string;
  isFrozen: boolean;
  isAdmin: boolean;
}

export class LoginVo {
  userInfo: UserInfo;
  token: string;
  roles: string[];
  permissions: string[];
}
