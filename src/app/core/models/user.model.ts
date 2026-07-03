import { Role } from './role.model';

export interface User {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  phone: string;
  avatar?: string;
  roleId: Role;
  status: 'active' | 'inactive' | string;
  createdAt: Date;
  updatedAt: Date
}
