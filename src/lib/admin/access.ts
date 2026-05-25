export function canUseAdmin() {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  return process.env.ALLOW_UNAUTHENTICATED_ADMIN === "true";
}
