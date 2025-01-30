import { db } from "@db/index";
import { goalCompletions } from "@db/schema";
import { eq } from "drizzle-orm";

interface IDeleteGoalRequest {
  id: string;
}

export const deleteGoalCompletion = async ({ id }: IDeleteGoalRequest) => {
  const goalExists = await db
    .select()
    .from(goalCompletions)
    .where(eq(goalCompletions.id, id))
    .limit(1);

  if (!goalExists[0]) {
    throw new Error(
      "This goal completion doens't exist. Please, check its Id."
    );
  }

  await db
    .delete(goalCompletions)
    .where(eq(goalCompletions.id, id))
    .returning();
};
