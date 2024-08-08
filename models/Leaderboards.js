import mongoose from "mongoose";

export default mongoose.model('Leaderboards', {
  attempt: { type: Number, default: 0 },
  startTime: { type: Number, default: 0 },
  endTime: { type: Number, default: null },
  numberToFind: { type: String, default: '0' },
  user: { type: mongoose.Types.ObjectId, ref: 'Users' },
}, 'leaderboards');