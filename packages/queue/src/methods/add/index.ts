import z from "zod";
import { randomUUID } from "crypto";
import { Database } from "../_ports";

const validator = z.object({
  alias: z.string(),
  timeInSeconds: z.number(),
  requester: z.string(),
});

const add = (database: Database) => {
  return async (item: unknown) => {
    const incomingData = await validator.parseAsync(item);

    const id = randomUUID();

    await database.add({
      ...incomingData,
      id,
    });

    return {
      id,
    };
  };
};

export default add;
