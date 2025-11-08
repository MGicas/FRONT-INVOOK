import { useApiAction } from "../../../shared/hooks/useApiAction";
import { sendMessagesToLenders } from "../service/sendMessage";

export function useSendMessagesToLenders() {
  const { run, loading, message, isError } = useApiAction();

  const execute = () => run(sendMessagesToLenders);

  return { execute, loading, message, isError };
}
