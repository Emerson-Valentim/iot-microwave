import React, { useState } from "react";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { getQueue } from "../../network/fetch";

const Queue = () => {
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
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Note</Th>
            <Th>Requester</Th>
            <Th isNumeric>{`Time (seconds)`}</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map(
            ({ id, alias, requester, status, timeInSeconds }, index) => {
              return (
                <Tr key={`${index}-table-item`}>
                  <Td>{id}</Td>
                  <Td>{alias}</Td>
                  <Td>{requester} (mm)</Td>
                  <Td isNumeric>{timeInSeconds}</Td>
                  <Td>{status}</Td>
                </Tr>
              );
            }
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default Queue;
