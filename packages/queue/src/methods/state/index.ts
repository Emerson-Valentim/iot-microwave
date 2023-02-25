import { Database } from "../_ports";

const state = (database: Database) => {
  return async () => {
    const elements = (await database.list()).map((element) => ({
      ...element,
      status: "PENDING",
    }));

    const currentElement = await database.current();

    if (!currentElement) {
      return elements;
    }

    return [
      {
        ...currentElement,
        status: "COOKING",
      },
      ...elements,
    ];
  };
};

export default state;
