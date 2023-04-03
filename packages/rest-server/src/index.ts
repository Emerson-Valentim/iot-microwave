import Koa from "koa";
import serverless from "serverless-http";
import Router, { Middleware } from "@koa/router";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";

export interface HandlerParams {
  router: Router;
  app: Koa;
}

interface Handlers {
  verb: "get" | "post" | "delete";
  callback: Middleware;
  subpath?: string;
}

interface BaseNode {
  path: string;
}

interface Route extends BaseNode {
  handlers: Handlers[];
}

type Node = Route;

export interface Server {
  routes: Node[];
  middlewares?: Middleware[];
  port: number;
}

const rest = ({ port, routes, middlewares }: Server) => {
  const app = new Koa({
    env: process.env.NODE_ENV,
  });

  const router = new Router();

  routes.forEach(({ path, handlers }) => {
    handlers.forEach(({ verb, subpath = "", callback }) => {
      console.log(`Registering route: ${verb}:${path + subpath}`);

      router[verb](`${path}${subpath}`, callback);
    });
  });

  app.use(bodyParser()).use(cors());
  app.use((ctx, next) => {
    const startedAt = new Date().toISOString();
    const request: any = {
      method: ctx.method,
      path: ctx.path,
      body: getObjectIfHasKeys(ctx.response.body),
      headers: getObjectIfHasKeys(ctx.headers),
      query: getObjectIfHasKeys(ctx.query),
    };

    return next()
      .catch(() => {
        if (!ctx.response.body) {
          ctx.response.body = { message: "Internal server error" };
          ctx.response.status = 500;
        }
      })
      .finally(() => {
        console.log(
          JSON.stringify({
            startedAt,
            finishedAt: new Date().toISOString(),
            request,
            response: {
              body: getObjectIfHasKeys(ctx.response.body),
            },
          })
        );
      });
  });

  middlewares?.forEach((middleware) => {
    app.use(middleware);
  });

  app.use(router.routes()).use(router.allowedMethods());

  app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`Server running at ${port ?? "🌥️"} 👾`);

  return app;
};

const getObjectIfHasKeys = (data: unknown) => {
  return Object.keys(data ?? {}).length ? data : undefined;
};

export { rest, serverless };
