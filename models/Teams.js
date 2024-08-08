import mongoose from "mongoose";

export default mongoose.model('Teams', {
  name:    { index: true, unique: true, type: String, required: true },
  members: { type: [mongoose.Types.ObjectId], ref: 'Users' },
}, 'teams')