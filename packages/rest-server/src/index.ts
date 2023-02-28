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

  app.use(async (_, next) => {
    console.log({
      timestamp: new Date().toISOString(),
      ..._.request.req,
    });
    await next();
  });

  app.use(bodyParser()).use(cors());

  middlewares?.forEach((middleware) => {
    app.use(middleware);
  });

  app.use(router.routes()).use(router.allowedMethods());

  app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`Server running at ${port ?? "🌥️"} 👾`);

  return app;
};

export { rest, serverless };
