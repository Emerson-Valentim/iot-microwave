import Redis from "ioredis";

export interface Cache {
  add: (params: AddParams) => Promise<void>;
  push: (params: PushParams) => Promise<number>;
  pop: (params: PopParams) => Promise<string | null>;
  list: (params: ListParams) => Promise<string[]>;
  get: (params: GetParams) => Promise<string | null>;
  delete: (params: DeleteParams) => Promise<number>;
}

interface AddParams {
  key: string;
  element: string;
}

interface PushParams {
  key: string;
  element: string;
}

interface PopParams {
  key: string;
}

interface ListParams {
  key: string;
}

interface GetParams {
  key: string;
}

interface DeleteParams {
  key: string;
}

const add = (client: Redis) => {
  return async ({ key, element }: AddParams) => {
    await client.set(key, element);
    return;
  };
};

const push = (client: Redis) => {
  return ({ key, element }: PushParams) => {
    return client.lpush(key, element);
  };
};

const pop = (client: Redis) => {
  return ({ key }: PopParams) => {
    return client.rpop(key);
  };
};

const list = (client: Redis) => {
  return ({ key }: ListParams) => {
    return client.lrange(key, 0, -1);
  };
};

const get = (client: Redis) => {
  return async ({ key }: GetParams) => {
    return client.get(key);
  };
};

const _delete = (client: Redis) => {
  return async ({ key }: DeleteParams) => {
    return client.del(key);
  };
};

export default (path: string): Cache => {
  const client = new Redis(path);

  return {
    add: add(client),
    list: list(client),
    push: push(client),
    pop: pop(client),
    get: get(client),
    delete: _delete(client),
  };
};
