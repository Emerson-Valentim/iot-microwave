import { CloseIcon } from "@chakra-ui/icons";
import { Fade, FormControl } from "@chakra-ui/react";
import { ChangeEvent, useCallback, useState } from "react";
import { Button, Card, Input, Spacer, Text } from "../../components";
import { addItem } from "../../network/fetch";

const Form: React.FC<{
  isOpen: boolean;
  onClose: (state: boolean) => void;
}> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [alias, setAlias] = useState<string>("");
  const [requester, setRequester] = useState<string>("");
  const [timeInSeconds, setTimeInSeconds] = useState<number>(0);

  const readInputEvent =
    (setter: React.Dispatch<any>) => (e: ChangeEvent<{ value: string }>) =>
      setter(e.target.value);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      await addItem({
        alias,
        requester,
        timeInSeconds: +timeInSeconds,
      });
    } finally {
      setLoading(false);
    }
  }, [alias, requester, timeInSeconds]);

  const hasError =
    alias.length < 5 ||
    requester.length < 5 ||
    timeInSeconds < 1 ||
    timeInSeconds > 30;

  return isOpen ? (
    <Fade
      style={{
        height: "100vh",
        width: "-webkit-fill-available",
        zIndex: "100",
        backgroundColor: "rgba(77, 77, 77, 0.7)",
        position: "absolute",
        top: "0",
        left: "0",
        alignContent: "center",
        justifyContent: "center",
        display: "flex",
      }}
      in={isOpen}
    >
      <div
        style={{
          padding: "12px",
          width: "-webkit-fill-available",
        }}
      >
        <Card>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text variant="title.default" color="text.main.default">
              Request details
            </Text>
            <CloseIcon
              onClick={onClose as any}
              style={{ right: "0", position: "absolute" }}
            />
          </div>
          <FormControl
            display="flex"
            flexDirection="column"
            width="100%"
            isRequired
          >
            <Input
              label="Event name"
              type="alias"
              placeholder="My meal"
              onChange={readInputEvent(setAlias)}
              value={alias}
              required
            />
            <Spacer variant="stack_medium" />
            <Input
              label="Your name"
              placeholder="SBP"
              type="requester"
              onChange={readInputEvent(setRequester)}
              value={requester}
              required
            />
            <Spacer variant="stack_medium" />
            <Input
              label="Time"
              placeholder="15"
              type="timeInSeconds"
              onChange={readInputEvent(setTimeInSeconds)}
              required
              helperText="In seconds"
            />

            <Spacer variant="stack_medium" />
            <Button
              onClick={handleSubmit}
              disabled={hasError}
              loading={loading}
            >
              Request
            </Button>
          </FormControl>
        </Card>
      </div>
    </Fade>
  ) : (
    <></>
  );
};

export default Form;
