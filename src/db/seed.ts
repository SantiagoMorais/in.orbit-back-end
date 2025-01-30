// Seed é importante para que quando alguém acessar nosso projeto, já tenha alguns itens adicionados no banco de dados
import { client, db } from ".";
import { goalCompletions, goals } from "./schema";
import dayjs from "dayjs";

const seed = async () => {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const result = await db
    .insert(goals)
    .values([
      { title: "Acordar cedo", desiredWeeklyFrequency: 5 },
      { title: "Me exercitar", desiredWeeklyFrequency: 3 },
      { title: "Fazer minhas orações", desiredWeeklyFrequency: 7 },
    ])
    .returning();

  const startOfWeek = dayjs().startOf("week");

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[1].id, createdAt: startOfWeek.add(1, "day").toDate() },
  ]);
};

seed().finally(() => {
  client.end();
});
