import { DBUserModel } from "../db/models";

export class UserModel {
  id: string;
  email: string;
  full_name?: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  is_verified?: boolean;

  constructor(dbUserModel: DBUserModel) {
    this.id = dbUserModel.id;
    this.email = dbUserModel.email;
    this.full_name = dbUserModel.full_name;
    this.created_at = new Date(dbUserModel.created_at);
    this.updated_at = new Date(dbUserModel.updated_at);
    this.is_active = dbUserModel.is_active === 1;
    this.is_verified = dbUserModel.is_verified === 1;
  }
}
