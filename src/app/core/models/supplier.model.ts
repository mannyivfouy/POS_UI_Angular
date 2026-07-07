export interface Supplier {
  _id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive' | string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}
