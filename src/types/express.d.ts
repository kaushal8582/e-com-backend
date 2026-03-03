import { JwtPayload } from '../middleware/auth.js';

declare global {
  namespace Express {
    interface Request {
      tokenPayload?: JwtPayload;
    }
  }
}

export {};
