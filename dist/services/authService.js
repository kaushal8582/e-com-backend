"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.getMe = getMe;
exports.requestPasswordReset = requestPasswordReset;
exports.resetPassword = resetPassword;
exports.loginWithGoogle = loginWithGoogle;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const userRepo = __importStar(require("../repositories/userRepository.js"));
const emailLib = __importStar(require("../lib/email.js"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
async function register(name, email, password) {
    const existing = await userRepo.findByEmail(email);
    if (existing) {
        throw new Error('Email already registered');
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const user = await userRepo.createUser({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: 'USER',
    });
    const token = jsonwebtoken_1.default.sign({ userId: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    const u = user.toObject();
    delete u.passwordHash;
    return { user: u, token };
}
async function login(email, password) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const valid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!valid) {
        throw new Error('Invalid email or password');
    }
    const token = jsonwebtoken_1.default.sign({ userId: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    const u = user.toObject();
    delete u.passwordHash;
    emailLib.sendLoginNotification(user.email, user.name, new Date()).catch(() => { });
    return { user: u, token };
}
async function getMe(userId) {
    const user = await userRepo.findById(userId);
    if (!user)
        return null;
    const u = user.toObject();
    delete u.passwordHash;
    return u;
}
const RESET_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
async function requestPasswordReset(email) {
    const user = await userRepo.findByEmail(email);
    if (!user)
        return;
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + RESET_EXPIRY_MS);
    await userRepo.setResetToken(email, token, expiry);
    const baseUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
    const resetLink = `${baseUrl}/reset-password?token=${token}`;
    emailLib.sendPasswordReset(user.email, resetLink).catch(() => { });
}
async function resetPassword(token, newPassword) {
    const user = await userRepo.findByResetToken(token);
    if (!user)
        throw new Error('Invalid or expired reset link');
    const passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
    await userRepo.updatePasswordClearReset(user._id.toString(), passwordHash);
}
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
async function loginWithGoogle(idToken) {
    if (!GOOGLE_CLIENT_ID)
        throw new Error('Google sign-in is not configured');
    const client = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload.sub)
        throw new Error('Invalid Google token');
    const googleId = payload.sub;
    const email = payload.email.toLowerCase();
    const name = (payload.name || payload.email?.split('@')[0] || 'User').trim();
    let user = await userRepo.findByGoogleId(googleId);
    if (user) {
        const u = user.toObject();
        delete u.passwordHash;
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
        emailLib.sendLoginNotification(user.email, user.name, new Date()).catch(() => { });
        return { user: u, token };
    }
    user = await userRepo.findByEmail(email);
    if (user) {
        if (!user.googleId)
            await userRepo.setGoogleId(user._id.toString(), googleId);
        const u = user.toObject();
        delete u.passwordHash;
        const token = jsonwebtoken_1.default.sign({ userId: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
        emailLib.sendLoginNotification(user.email, user.name, new Date()).catch(() => { });
        return { user: u, token };
    }
    const passwordHash = await bcryptjs_1.default.hash(crypto_1.default.randomBytes(24).toString('hex'), 10);
    user = await userRepo.createUser({
        name,
        email,
        passwordHash,
        role: 'USER',
        googleId,
    });
    const u = user.toObject();
    delete u.passwordHash;
    const token = jsonwebtoken_1.default.sign({ userId: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    emailLib.sendLoginNotification(user.email, user.name, new Date()).catch(() => { });
    return { user: u, token };
}
