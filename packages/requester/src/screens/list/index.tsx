import { useEffect, useState } from "react";
import { Badge, Card, Spacer, Text } from "../../components";
import { getQueue } from "../../network/fetch";

const Header: React.FC = () => {
  const [data, setData] = useState<
    {
      id: string;
      alias: string;
      timeInSeconds: string;
      requester: string;
      status: string;
    }[]
  >([]);

  useEffect(() => {
    runGetQueue();

    const pooling = setInterval(() => {
      runGetQueue();
    }, 2000);

    return () => {
      clearInterval(pooling);
    };
  }, []);

  const runGetQueue = async () => {
    const axiosData = (await getQueue()).data;
    setData(JSON.parse(axiosData));
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {data.map(({ alias, requester, status }, index) => {
        return (
          <>
            <Card>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Badge variant={status as any}>{status}</Badge>
                <Spacer variant="stack_small" />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ width: "50%", textAlign: "left" }}>
                    <Text variant="body.md_bold" color="text.main.subdued">
                      Event name
                    </Text>
                    <Text variant="body.md_regular" color="text.main.default">
                      {alias}
                    </Text>
                  </div>
                  <Spacer variant="inline_medium" />
                  <div style={{ width: "50%", textAlign: "left" }}>
                    <Text variant="body.md_bold" color="text.main.subdued">
                      Requester
                    </Text>
                    <Text variant="body.md_regular" color="text.main.default">
                      {requester}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>
            <Spacer variant="stack_small" />
          </>
        );
      })}
    </div>
  );
};

export default Header;
