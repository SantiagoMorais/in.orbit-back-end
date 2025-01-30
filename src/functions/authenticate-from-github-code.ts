import { db } from "@db/index";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";
import { env } from "env";
import { authenticateUser } from "modules/auth";
import {
  getAccessTokenFromCode,
  getUserFromAccessToken,
} from "modules/github-oauth";

interface IAuthenticateFromGithubCodeRequest {
  code: string;
}

export const authenticateFromGithubCode = async ({
  code,
}: IAuthenticateFromGithubCodeRequest) => {
  const accessToken = await getAccessTokenFromCode(code);
  const githubUser = await getUserFromAccessToken(accessToken);

  const result = await db
    .select()
    .from(users)
    .where(eq(users.externalAccountId, githubUser.id));

  let userId: string | null;

  const userAlreadyExists = result.length > 0;

  if (userAlreadyExists) {
    userId = result[0].id;
  } else {
    const [insertedUser] = await db
      .insert(users)
      .values({
        avatarUrl: githubUser.avatar_url,
        externalAccountId: githubUser.id,
        name: githubUser.name,
        email: githubUser.email,
      })
      .returning();

    userId = insertedUser.id;
  }

  const token = await authenticateUser(userId);

  return { token };
};
