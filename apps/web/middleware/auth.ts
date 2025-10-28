export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user } = useUser();

  // Define public routes that don't need authentication
  const publicRoutes = ['/', '/auth'];
  const isPublicRoute = publicRoutes.includes(to.path);

  // If user is not authenticated
  if (user.value == null) {
    // Allow access to public routes
    if (isPublicRoute) {
      return;
    }
    // Redirect to auth for protected routes
    console.log('Not authenticated, redirecting to /auth');
    return navigateTo('/auth');
  }

  // If user IS authenticated
  // Redirect from root to dashboard
  if (to.path === '/') {
    return navigateTo('/dashboard');
  }

  // Redirect from auth to dashboard (already logged in)
  if (to.path === '/auth') {
    return navigateTo('/dashboard');
  }
});
