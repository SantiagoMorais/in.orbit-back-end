import z from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
})

const _env = envSchema.safeParse(process.env);

if (!_env.success) throw new Error("Invalid Environment Variables ❌")

export const env = _env.data;