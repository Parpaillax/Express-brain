import mongoose from 'mongoose';

import { Goose } from '../../database/index.js';

export default async function retrieveGoose(id, operation = "find") {
    const _id = mongoose.Types.ObjectId.createFromHexString(id);

    switch (operation) {
        case "delete": return Goose.findByIdAndDelete(_id);
        case "find": return Goose.findById(_id);
        default: return;
    }
}