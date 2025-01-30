import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "../env";

export const client = postgres(env.DATABASE_URL);
// Aqui só precisamos passar para o postgres nossa url
export const db = drizzle(client, { schema, logger: true });
// logger significa que sempre que recebermos um novo dado, ele aparecerá em nosso terminal.
