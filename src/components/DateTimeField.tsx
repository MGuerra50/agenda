import { useState } from "react";
import { Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, Dialog, Portal } from "react-native-paper";
import { dateKey, parseDate, shortDate } from "../utils/dateUtils";
import { FieldCard } from "./ui";

export type DateTimeFieldProps = {
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
}: DateTimeFieldProps) {
  const [visible, setVisible] = useState(false);
  const makeDate = () => {
    if (mode === "date") return parseDate(value);
    const date = new Date();
    const [hours, minutes] = value.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };
  const [draft, setDraft] = useState(makeDate);
  const commit = (date: Date) =>
    onChange(
      mode === "date"
        ? dateKey(date)
        : `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
    );
  const picker = (
    <DateTimePicker
      value={draft}
      mode={mode}
      is24Hour
      locale="pt-BR"
      display={Platform.OS === "ios" ? "spinner" : "default"}
      onChange={(event, date) => {
        if (Platform.OS !== "ios") {
          setVisible(false);
          if (event.type === "set" && date) commit(date);
        } else if (date) setDraft(date);
      }}
    />
  );
  return (
    <>
      <FieldCard
        compact={mode === "time"}
        label={label}
        value={mode === "date" ? shortDate(value) : value}
        icon={mode === "date" ? "calendar-blank-outline" : "clock-outline"}
        disabled={disabled}
        onPress={() => {
          setDraft(makeDate());
          setVisible(true);
        }}
      />
      {visible && Platform.OS !== "ios" ? picker : null}
      {Platform.OS === "ios" && (
        <Portal>
          <Dialog
            visible={visible}
            onDismiss={() => setVisible(false)}
            style={{ width: "90%", maxWidth: 420, alignSelf: "center" }}
          >
            <Dialog.Title>{label}</Dialog.Title>
            <Dialog.Content>{visible ? picker : null}</Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setVisible(false)}>Cancelar</Button>
              <Button
                onPress={() => {
                  commit(draft);
                  setVisible(false);
                }}
              >
                Confirmar
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}
    </>
  );
}
