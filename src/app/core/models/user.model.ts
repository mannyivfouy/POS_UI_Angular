import { Role } from './role.model';

export interface User {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  phone: string;
  avatar?: string;
  role: Role;
  status: 'active' | 'inactive' | string;
}
