export interface User extends UserInputDto {
  id: number;
}

export interface UserInputDto {
  name: string;
  email: string;
  phone: string;
  address: string;
  fkRoleId: number | null;
}
