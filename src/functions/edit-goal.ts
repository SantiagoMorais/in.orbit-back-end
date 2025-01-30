import { db } from "@db/index";
import { goalCompletions, goals } from "@db/schema";
import { eq } from "drizzle-orm";

interface IEditGoal {
  title: string;
  desiredWeeklyFrequency: number;
  id: string;
}

export const editGoal = async ({
  title,
  desiredWeeklyFrequency,
  id,
}: IEditGoal) => {
  const selectedGoal = await db
    .select()
    .from(goals)
    .where(eq(goals.id, id))
    .limit(1);

  const goalsCompletion = await db
    .select()
    .from(goalCompletions)
    .where(eq(goalCompletions.goalId, id));

  if (!selectedGoal[0]) {
    throw new Error("This goal doens't exist. Please, check its id.");
  }

  if (title.length < 2) {
    throw new Error("This title is not valid.");
  }

  if (desiredWeeklyFrequency < goalsCompletion.length) {
    throw new Error(
      "You can't set the desired weekly frequency to be less than the number of completions that you already had."
    );
  }

  await db
    .update(goals)
    .set({ title, desiredWeeklyFrequency })
    .where(eq(goals.id, id))
    .returning();
};
