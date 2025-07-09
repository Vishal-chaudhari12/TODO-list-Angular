export interface Employee {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  department?: string;
  position?: string;
  salary?: number;
  hireDate?: Date;
  address?: string;
} 