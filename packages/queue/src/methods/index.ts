import add from "./add";
import state from "./state";
import finish from "./finish";
import consume from "./consume";
import { database } from "./_ports";

export default ({ dbUrl }: { dbUrl: string }) => {
  const db = database(dbUrl);

  return {
    add: add(db),
    consume: consume(db),
    finish: finish(db),
    state: state(db),
  };
};
