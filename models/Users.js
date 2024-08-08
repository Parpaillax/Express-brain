import mongoose from "mongoose";
import {RolesUsers} from "../enums/roles-users.js"

export default mongoose.model('Users', {
  email:    { index: true, unique: true, type: String, required: true },
  nickName: { index: true, unique: true, type: String, required: true },
  password: { index: true, unique: true, type: String, required: true },
  role: {type: String, enum: RolesUsers, default: RolesUsers.USER},
  score: {type: Number, default: 0},
}, 'users')