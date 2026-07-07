export interface Category {
  _id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | string;
  createdAt: Date;
  updatedAt: Date;
}
