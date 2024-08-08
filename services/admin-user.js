import Users from "../models/Users.js";
import argon2 from "argon2";
import {RolesUsers} from "../enums/roles-users.js";

export default class AdminUser {
  static async createAdmin() {
    const admin = await Users.findOne({ email: 'prp@gmail.com' })
    if (!admin) {
      await Users.create({
        email: 'prp@gmail.com',
        nickName: 'prp',
        password: `${await argon2.hash('prp')}`,
        role: RolesUsers.ADMIN,
      })
      console.log('Admin created')
    }
  }
}