import { Button, Stack, Alert } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useSendMessagesToLenders } from "../hook/useSendMessage";

const SendMessage = () => {
  const { execute, loading, message, isError } = useSendMessagesToLenders();

  return (
    <Stack spacing={2} alignItems="center">
      <Button
        variant="contained"
        color="success"
        onClick={execute}
        disabled={loading}
      >
        {loading ? (
          <>
            <CircularProgress size={20} sx={{ mr: 1 }} /> Enviando mensajes...
          </>
        ) : (
          "Enviar recordatorios a prestamistas"
        )}
      </Button>

      {message && (
        <Alert severity={isError ? "error" : "success"}>{message}</Alert>
      )}
    </Stack>
  );
};

export default SendMessage;
