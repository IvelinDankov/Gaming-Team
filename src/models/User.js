import { Schema, model, Types } from "mongoose";

import bcrypt from 'bcrypt';

const SALT = 10; 

const userSchema = new Schema({

    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

userSchema.pre('save',async function () {
    const hash = await bcrypt.hash(this.password, SALT);

    this.password = hash;
})

const User = model('User', userSchema);

export default User;