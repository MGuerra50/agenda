import { useState } from "react";
import {
  Button,
  Dialog,
  HelperText,
  Portal,
  TextInput,
} from "react-native-paper";
import { isValidDate, isValidTime, shortDate } from "../utils/dateUtils";
import { FieldCard } from "./ui";

type Props = {
  label: string;
  value: string;
  mode: "date" | "time";
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function DateTimeField({
  label,
  value,
  mode,
  onChange,
  disabled,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState(value);
  const valid = mode === "date" ? isValidDate(draft) : isValidTime(draft);
  return (
    <>
      <FieldCard
        compact={mode === "time"}
        label={label}
        value={mode === "date" ? shortDate(value) : value}
        icon={mode === "date" ? "calendar-blank-outline" : "clock-outline"}
        disabled={disabled}
        onPress={() => {
          setDraft(value);
          setVisible(true);
        }}
      />
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={{ width: "90%", maxWidth: 420, alignSelf: "center" }}
        >
          <Dialog.Title>{label}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label={mode === "date" ? "Data (AAAA-MM-DD)" : "Horário (HH:mm)"}
              value={draft}
              onChangeText={setDraft}
              error={!valid}
              accessibilityLabel={
                mode === "date" ? "Data (AAAA-MM-DD)" : "Horário (HH:mm)"
              }
            />
            <HelperText type={valid ? "info" : "error"}>
              {mode === "date"
                ? "Exemplo: 2026-11-15"
                : "Use o formato de 24 horas, por exemplo 14:30."}
            </HelperText>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Cancelar</Button>
            <Button
              disabled={!valid}
              onPress={() => {
                onChange(draft);
                setVisible(false);
              }}
            >
              Confirmar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
