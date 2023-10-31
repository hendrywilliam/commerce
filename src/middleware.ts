import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

export default authMiddleware({
  // add public routes
  publicRoutes: ["/", "/sign-up", "/sign-in", "/api/(.*)"],

  afterAuth(auth, req, evt) {
    //handle users who arent authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)"],
};
