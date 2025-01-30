import { db } from "@db/index";
import { goalCompletions, goals } from "@db/schema";
import { eq } from "drizzle-orm";

interface IDeleteGoalRequest {
  id: string;
}

export const deleteGoal = async ({ id }: IDeleteGoalRequest) => {
  const goalExists = await db
    .select()
    .from(goals)
    .where(eq(goals.id, id))
    .limit(1);

  if (!goalExists[0]) {
    throw new Error("This goal doens't exist. Please, check its Id.");
  }

  await db
    .delete(goalCompletions)
    .where(eq(goalCompletions.goalId, id))
    .returning();
  await db.delete(goals).where(eq(goals.id, id)).returning();
};
