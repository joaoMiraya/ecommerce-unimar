

export type BasicUser = {
  name: string;
  email: string;
  createdAt: Date;
}

export type User = {
  name: string;
  email: string;
  createdAt: Date;
  phone?: string;
  addresses?: Address[];

}
export type Address = {
  id?: string;
  city?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  zipCode?: string;
}

export type UpdateUser = {
  name: string;
  email: string;
}
