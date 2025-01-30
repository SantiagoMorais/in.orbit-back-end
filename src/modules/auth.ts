import { env } from "env";
import { SignJWT } from "jose";

export const authenticateUser = async (userId: string) => {
  const secret = new TextEncoder().encode(env.JWT_SECRET);

  const token = await new SignJWT()
    .setSubject(userId)
    .setExpirationTime("1d")
    .setIssuedAt()
    .sign(secret);

  return token;
};
