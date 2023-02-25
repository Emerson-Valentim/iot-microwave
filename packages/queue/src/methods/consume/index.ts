import { Database } from "../_ports";

const consume = (database: Database) => {
  return async () => {
    const hasCurrentElement = await database.current();

    if (hasCurrentElement) {
      throw new Error("BAD_REQUEST");
    }

    const element = await database.consume();

    if (!element) {
      throw new Error("NOT_FOUND");
    }

    return element;
  };
};

export default consume;
