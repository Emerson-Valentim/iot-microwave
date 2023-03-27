import cache, { Cache } from "cache";

export interface Database {
  add: (element: MicrowaveRequest) => Promise<void>;
  consume: () => Promise<MicrowaveRequest | null>;
  list: () => Promise<MicrowaveRequest[]>;
  current: () => Promise<MicrowaveRequest | null>;
  remove: () => Promise<void>;
}

export interface MicrowaveRequest {
  id: string;
  alias: string;
  timeInSeconds: number;
  requester: string;
}

const QUEUE_KEY = "microwave:queue";
const CURRENT_ITEM_KEY = "microwave:current";

const add = (client: Cache) => {
  return async (element: MicrowaveRequest) => {
    await client.push({
      key: QUEUE_KEY,
      element: JSON.stringify(element),
    });

    return;
  };
};

const consume = (client: Cache) => {
  return async () => {
    const element = await client.pop({
      key: QUEUE_KEY,
    });

    if (!element) {
      return;
    }

    await client.add({
      key: CURRENT_ITEM_KEY,
      element,
    });

    return JSON.parse(element);
  };
};

const current = (client: Cache) => {
  return async () => {
    const element = await client.get({ key: CURRENT_ITEM_KEY });

    if (!element) {
      return;
    }

    return JSON.parse(element);
  };
};

const list = (client: Cache) => {
  return async () => {
    const result = await client.list({
      key: QUEUE_KEY,
    });

    return result.map((item) => JSON.parse(item)).reverse();
  };
};

const remove = (client: Cache) => {
  return async () => {
    await client.delete({ key: CURRENT_ITEM_KEY });
  };
};

export const database = (dbUrl: string): Database => {
  const client = cache(dbUrl);

  return {
    add: add(client),
    list: list(client),
    consume: consume(client),
    current: current(client),
    remove: remove(client),
  };
};
