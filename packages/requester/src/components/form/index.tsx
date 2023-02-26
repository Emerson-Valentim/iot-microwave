import { Button, FormControl, Input } from "@chakra-ui/react";
import { ChangeEvent, useCallback, useState } from "react";
import { addItem } from "../../network/fetch";

const Form = () => {
  const [alias, setAlias] = useState<string>("");
  const [requester, setRequester] = useState<string>("");
  const [timeInSeconds, setTimeInSeconds] = useState<number>(0);

  const readInputEvent =
    (setter: React.Dispatch<any>) => (e: ChangeEvent<{ value: string }>) =>
      setter(e.target.value);

  const handleSubmit = useCallback(async () => {
    await addItem({
      alias,
      requester,
      timeInSeconds: +timeInSeconds,
    });
  }, [alias, requester, timeInSeconds]);

  const hasError =
    alias.length < 5 ||
    requester.length < 5 ||
    timeInSeconds < 1 ||
    timeInSeconds > 30;

  return (
    <FormControl display="flex" flexDirection="column" width="100%" isRequired>
      <Input
        type="alias"
        placeholder="Event name"
        onChange={readInputEvent(setAlias)}
        value={alias}
        required
      />
      <Input
        placeholder="Your name"
        type="requester"
        onChange={readInputEvent(setRequester)}
        value={requester}
        required
      />
      <Input
        placeholder="Time in seconds"
        type="timeInSeconds"
        onChange={readInputEvent(setTimeInSeconds)}
        required
      />
      <Button onClick={handleSubmit} isDisabled={hasError}>
        Request
      </Button>
    </FormControl>
  );
};

export default Form;
