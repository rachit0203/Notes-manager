import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

// This is the standard middleware provided by Clerk to protect routes.
// It automatically verifies the JWT from the request headers and attaches
// the `auth` object to the request, which contains the userId.
export const clerkAuthMiddleware = ClerkExpressWithAuth();