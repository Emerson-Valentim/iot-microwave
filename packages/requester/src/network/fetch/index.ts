import { Axios } from "axios";

const URL = process.env.REACT_APP_API_URL;
const client = new Axios({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getQueue = () => {
  return client.get("/");
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
  return client.request({
    method: "post",
    data: JSON.stringify({
      requester,
      timeInSeconds,
      alias,
    }),
  });
};

export { getQueue, addItem };
