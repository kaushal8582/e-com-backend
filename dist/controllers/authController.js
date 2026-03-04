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
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.me = me;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.googleLogin = googleLogin;
const authService = __importStar(require("../services/authService.js"));
async function register(req, res) {
    const { name, email, password } = req.body;
    const { user, token } = await authService.register(name, email, password);
    res.status(201).json({ success: true, user, token });
}
async function login(req, res) {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.json({ success: true, user, token });
}
async function logout(_req, res) {
    res.json({ success: true, message: 'Logged out' });
}
async function me(req, res) {
    const userId = req.tokenPayload?.userId;
    if (!userId) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
    }
    const user = await authService.getMe(userId);
    if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
    }
    res.json({ success: true, user });
}
async function forgotPassword(req, res) {
    const { email } = req.body;
    await authService.requestPasswordReset(email);
    res.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
}
async function resetPassword(req, res) {
    const { token, newPassword } = req.body;
    try {
        await authService.resetPassword(token, newPassword);
        res.json({ success: true, message: 'Password reset successfully' });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Invalid or expired reset link';
        res.status(400).json({ success: false, message });
    }
}
async function googleLogin(req, res) {
    const { idToken } = req.body;
    try {
        const { user, token } = await authService.loginWithGoogle(idToken);
        res.json({ success: true, user, token });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Google sign-in failed';
        res.status(400).json({ success: false, message });
    }
}
