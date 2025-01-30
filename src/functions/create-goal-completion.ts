import { and, between, count, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import dayjs from "dayjs";

interface ICreateGoalRequest {
  goalId: string;
}

export const createGoalCompletion = async ({ goalId }: ICreateGoalRequest) => {
  const firstDayOfTheWeek = dayjs().startOf("week").toDate();
  const lastDayOfTheWeek = dayjs().endOf("week").toDate();

  const goalCompletionCounts = db.$with("goal_completion_counts").as(
    db
      .select({
        goalId: goalCompletions.goalId,
        // Sempre que eu faço alguma agregação, uso sql, crio um campo inexistente ou uso, por exemplo, o count abaixo, preciso usar o ".as"
        completionCount: count(goalCompletions.id).as("completionCount"),
      })
      .from(goalCompletions)
      .where(
        and(
          between(
            goalCompletions.createdAt,
            firstDayOfTheWeek,
            lastDayOfTheWeek,
          ),
          eq(goalCompletions.goalId, goalId)
        )
      )
      .groupBy(goalCompletions.goalId)
  );

  const result = await db
    .with(goalCompletionCounts)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql/* sql */ `
          COALESCE(${goalCompletionCounts.completionCount}, 0)
        `.mapWith(Number),
      // COALESCE do sql cria um 'if else' dentro do sql que, caso o valor seja null, é retornado um valor padrão. No nosso caso, escolhemos o valor zero 0
    })
    .from(goals)
    .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
    .where(eq(goals.id, goalId))
    .limit(1);

  const { completionCount, desiredWeeklyFrequency } = result[0];
  // A inserção de novos dados, por mais que adicionamos somente um, vai sempre retornar um array.
  // Portanto precisamos colocar o index 0 para coletar o dado.

  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error("Goal already completed this week!");
  }

  const insertResult = await db
    .insert(goalCompletions)
    .values({ goalId })
    .returning();
  const goalCompletion = insertResult[0];
  //Preciso adicionar o returning(), pois, por padrão, os db's não retornam os dados inseridos, somente, no máximo, os dados afetados.
  //Usando o returning eu consigo ter acesso a eles

  return { goalCompletion };
};
