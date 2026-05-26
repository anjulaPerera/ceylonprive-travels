// This file augments Express's Request type globally.
// After this, every route handler can access req.user
// with full TypeScript autocomplete and type safety.

import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, "id" | "email" | "name" | "role">;
    }
  }
}

export {};
// The empty export is required to make TypeScript treat
// this as a module rather than a script, which enables
// the global augmentation above.
