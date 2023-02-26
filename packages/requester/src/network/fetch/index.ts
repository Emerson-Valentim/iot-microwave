import { Axios } from "axios";

const URL = process.env.REACT_APP_API_URL;
const client = new Axios({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getQueue = () => {
  return client.get("microwave");
};

const addItem = ({
  requester,
  timeInSeconds,
  alias,
}: {
  requester: string;
  timeInSeconds: number;
  alias: string;
}) => {
  return client.post(
    "microwave",
    JSON.stringify({
      requester,
      timeInSeconds,
      alias,
    })
  );
};

export { getQueue, addItem };
