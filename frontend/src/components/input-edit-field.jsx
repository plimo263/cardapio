import { TextField } from "@mui/material";
import isHotkey from "is-hotkey";
import { useCallback, useRef } from "react";
import { useClickAway } from "react-use";

// Teclas de atalho para execução de recursos com combinação.
const HOTKEY_VALIDADOR = {
  enter: (evt) => isHotkey("enter")(evt),
};

const InputEditField = ({
  wait,
  onSubmit,
  name,
  setName,
  label,
  placeholder,
  onClose,
  sx,
}) => {
  const ref = useRef(null);

  const onSalvarForm = useCallback(
    (e) => {
      if (HOTKEY_VALIDADOR.enter(e)) {
        // Atualiza o nome (se o mesmo tiver algo)
        if (e.target.value.length > 0) {
          onSubmit();
        }
      }
    },
    [onSubmit]
  );

  useClickAway(ref, () => {
    if (onClose) onClose();
  });

  return (
    <TextField
      ref={ref}
      disabled={wait}
      variant="standard"
      value={name}
      onChange={(e) => setName(e.target.value)}
      onKeyUp={onSalvarForm}
      autoFocus
      label={label}
      placeholder={placeholder}
      size="small"
      type="textarea"
      inputProps={{ style: sx }}
      minRows={1}
      sx={{ width: "100%" }}
    />
  );
};

export default InputEditField;
