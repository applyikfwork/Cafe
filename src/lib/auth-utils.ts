export function createAuthToken(): string {
  const timestamp = Date.now();
  const expiresAt = timestamp + (7 * 24 * 60 * 60 * 1000);
  return `${expiresAt}`;
}

export function verifyAuthToken(token: string): boolean {
  try {
    const expiresAt = parseInt(token);
    if (isNaN(expiresAt)) {
      return false;
    }
    return Date.now() < expiresAt;
  } catch {
    return false;
  }
}
