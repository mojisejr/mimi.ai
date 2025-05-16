import { createClient } from "@libsql/client";

// Initialize Torso database client
export const torso = createClient({
  url: process.env.TORSO_DATABASE_URL!,
  authToken: process.env.TORSO_AUTH_TOKEN!,
});
