import { db } from "@db/index";
import { goalCompletions, goals } from "@db/schema";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { between, count, eq, lte, sql } from "drizzle-orm";

dayjs.extend(weekOfYear);

export const getWeekPendingGoals = async () => {
  const firstDayOfTheWeek = dayjs().startOf("week").toDate();
  const lastDayOfTheWeek = dayjs().endOf("week").toDate();

  // Uso '$with' quando vou criar uma 'common table expression' e 'with' sem o '$' quando vou criar uma query que irá usar de outras tables com 'common table expression'
  const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(between(goals.createdAt, firstDayOfTheWeek, lastDayOfTheWeek))
    // Avaliar as metas onde a data de criação está entre o primeiro e o último dia da semana
  );

  const goalCompletionCounts = db.$with("goal_completion_counts").as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as("completionCount"),
      })
      .from(goalCompletions)
      .where(
        between(goalCompletions.createdAt, firstDayOfTheWeek, lastDayOfTheWeek)
      )
      .groupBy(goalCompletions.goalId)
  );

  const pendingGoals = await db
    .with(goalsCreatedUpToWeek, goalCompletionCounts)
    .select({
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
      completionCount: sql/* sql */ `
        COALESCE(${goalCompletionCounts.completionCount}, 0)
      `.mapWith(Number),
      // COALESCE do sql cria um 'if else' dentro do sql que, caso o valor seja null, é retornado um valor padrão. No nosso caso, escolhemos o valor zero 0
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(
      goalCompletionCounts,
      eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id)
    );

  return {
    pendingGoals,
  };
};
