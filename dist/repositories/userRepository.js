"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByEmail = findByEmail;
exports.findById = findById;
exports.createUser = createUser;
const User_js_1 = require("../models/User.js");
async function findByEmail(email) {
    return User_js_1.User.findOne({ email: email.toLowerCase() }).exec();
}
async function findById(id) {
    return User_js_1.User.findById(id).exec();
}
async function createUser(data) {
    const user = new User_js_1.User(data);
    return user.save();
}
