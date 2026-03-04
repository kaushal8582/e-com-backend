"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByEmail = findByEmail;
exports.findById = findById;
exports.createUser = createUser;
exports.findByGoogleId = findByGoogleId;
exports.setGoogleId = setGoogleId;
exports.findByResetToken = findByResetToken;
exports.setResetToken = setResetToken;
exports.updatePasswordClearReset = updatePasswordClearReset;
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
async function findByGoogleId(googleId) {
    return User_js_1.User.findOne({ googleId }).exec();
}
async function setGoogleId(userId, googleId) {
    return User_js_1.User.findByIdAndUpdate(userId, { $set: { googleId } }, { new: true }).exec();
}
async function findByResetToken(token) {
    return User_js_1.User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() },
    }).exec();
}
async function setResetToken(email, token, expiry) {
    return User_js_1.User.findOneAndUpdate({ email: email.toLowerCase() }, { $set: { resetToken: token, resetTokenExpiry: expiry } }, { new: true }).exec();
}
async function updatePasswordClearReset(userId, passwordHash) {
    return User_js_1.User.findByIdAndUpdate(userId, { $set: { passwordHash }, $unset: { resetToken: 1, resetTokenExpiry: 1 } }, { new: true }).exec();
}
