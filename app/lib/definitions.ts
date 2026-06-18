// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type SysUser = {
  userId?: number;
  deptId?: number | null;
  userName?: string;
  nickName?: string;
  email?: string | null;
  phoneNumber?: string | null;
  sex?: string | null;
  avatar?: string | null;
  password?: string;
  status?: string | null;
  deletedFlag?: string | null;
  loginIp?: string | null;
  loginDate?: Date | null;
  createDept?: number;
  createBy?: number;
  createTime?: Date;
  updateDept?: number;
  updateBy?: number;
  updateTime?: Date;
  remark?: string | null;
  roleNames?: string[];
};

export type SysMenu = {
  id?: number;
  path?: string;
  type?: string;
  parentId?: number | null;
  sorting?: number;
  name?: string;
  label?: string;
  perms?: string | null;
  icon?: string | null;
  status?: number;
  hiding?: number;
  createTime?: Date;
  createBy?: number;
  updateTime?: Date;
  updateBy?: number;
  delFlag?: string | null;
};

export type SysMenuTree = {
  id?: number;
  name?: string;
  label?: string;
  type?: string;
  path?: string;
  perms?: string | null;
  sorting?: number;
  status?: number;
  hiding?: number;
  children?: SysMenuTree[];
  icon?: string|undefined;
};

export type SysRole = {
  id?: number;
  name?: string;
  key?: string;
  dataScope?: number;
  status?: number;
  createTime?: Date;
  createBy?: number;
  updateTime?: Date;
  updateBy?: number;
  delFlag?: string | null;
};
