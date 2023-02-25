import { Database } from "../_ports";

const finish = (database: Database) => {
  return async () => {
    const currentElement = await database.current();

    if (!currentElement) {
      throw new Error("BAD_REQUEST");
    }

    await database.remove();

    return;
  };
};

export default finish;
