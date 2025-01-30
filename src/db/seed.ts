// Seed é importante para que quando alguém acessar nosso projeto, já tenha alguns itens adicionados no banco de dados
import { client, db } from ".";
import { goalCompletions, goals, users } from "./schema";
import dayjs from "dayjs";

const seed = async () => {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const [user] = await db
    .insert(users)
    .values({
      name: "John Doe",
      externalAccountId: 25849,
      avatarUrl: "https://github.dev/SantiagoMorais.png",
    })
    .returning();

  const result = await db
    .insert(goals)
    .values([
      { userId: user.id, title: "Acordar cedo", desiredWeeklyFrequency: 5 },
      { userId: user.id, title: "Me exercitar", desiredWeeklyFrequency: 3 },
      {
        userId: user.id,
        title: "Fazer minhas orações",
        desiredWeeklyFrequency: 7,
      },
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
