/**
 * Reads a required environment variable and fails fast with a clear message.
 * Missing configuration is an error, never a reason to silently skip a test.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable ${name}. See .env.example.`);
  }
  return value;
}
