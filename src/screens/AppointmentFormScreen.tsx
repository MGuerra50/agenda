import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Card,
  Dialog,
  HelperText,
  IconButton,
  Portal,
  RadioButton,
  Switch,
  Text,
  TextInput,
} from "react-native-paper";
import {
  categories,
  reminderLabel,
  reminderOptions,
} from "../constants/categories";
import { CategoryChip } from "../components/CategoryChip";
import { DateTimeField } from "../components/DateTimeField";
import { FieldCard, IconTile, pageStyles } from "../components/ui";
import { useAgenda } from "../context/AgendaContext";
import { useAppTheme } from "../theme/theme";
import { Appointment, AppointmentDraft } from "../types/agenda";
import { isValidDate, isValidTime } from "../utils/dateUtils";

type Props = {
  appointment?: Appointment;
  initialDate: string;
  onBack: () => void;
  onSave: (appointment: AppointmentDraft, id?: string) => void;
  onDirtyChange: (dirty: boolean) => void;
};

export function AppointmentFormScreen({
  appointment,
  initialDate,
  onBack,
  onSave,
  onDirtyChange,
}: Props) {
  const theme = useAppTheme();
  const { preferences } = useAgenda();
  const [initialDraft] = useState<AppointmentDraft>(() =>
    appointment
      ? { ...appointment, participants: [...appointment.participants] }
      : {
          title: "",
          description: "",
          date: initialDate,
          startTime: "09:00",
          endTime: "10:00",
          category: "trabalho",
          location: "",
          reminderMinutes: preferences.remindersEnabled
            ? preferences.defaultReminder
            : null,
          allDay: false,
          notes: "",
          participants: [],
        },
  );
  const [draft, setDraft] = useState(initialDraft);
  const [participantText, setParticipantText] = useState(
    initialDraft.participants.join(", "),
  );
  const [submitted, setSubmitted] = useState(false);
  const [reminderVisible, setReminderVisible] = useState(false);
  const dirty =
    JSON.stringify(draft) !== JSON.stringify(initialDraft) ||
    participantText !== initialDraft.participants.join(", ");
  const titleError = submitted && !draft.title.trim();
  const timeError =
    !draft.allDay &&
    (!isValidTime(draft.startTime) ||
      !isValidTime(draft.endTime) ||
      draft.endTime <= draft.startTime);

  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange(false), [onDirtyChange]);

  function update<K extends keyof AppointmentDraft>(
    key: K,
    value: AppointmentDraft[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function save() {
    setSubmitted(true);
    if (
      !draft.title.trim() ||
      !isValidDate(draft.date) ||
      timeError ||
      !categories.some((category) => category.id === draft.category)
    )
      return;
    const participants = [
      ...new Set(
        participantText
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean),
      ),
    ];
    onSave(
      {
        ...draft,
        title: draft.title.trim(),
        description: draft.description.trim(),
        location: draft.location.trim(),
        notes: draft.notes.trim(),
        participants,
        startTime: draft.allDay ? "" : draft.startTime,
        endTime: draft.allDay ? "" : draft.endTime,
      },
      appointment?.id,
    );
  }

  const inputTheme = {
    colors: {
      background: theme.colors.surface,
      surfaceVariant: theme.colors.surface,
    },
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={pageStyles.scroll}
        automaticallyAdjustKeyboardInsets
      >
        <View style={pageStyles.toolbar}>
          <IconButton
            icon="chevron-left"
            mode="contained"
            containerColor={theme.colors.primaryContainer}
            onPress={onBack}
            accessibilityLabel="Voltar do formulário"
            style={pageStyles.back}
          />
          <Text accessibilityRole="header" style={pageStyles.toolbarTitle}>
            {appointment ? "Editar compromisso" : "Novo compromisso"}
          </Text>
          <Button
            mode="contained"
            compact
            onPress={save}
            labelStyle={{ fontSize: 12 }}
          >
            Salvar
          </Button>
        </View>
        <View style={styles.fields}>
          <Card
            mode="contained"
            style={[
              styles.inputCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View style={styles.inputRow}>
              <IconTile icon="calendar-edit" />
              <TextInput
                label="Título do evento"
                value={draft.title}
                onChangeText={(value) => update("title", value)}
                maxLength={100}
                error={!!titleError}
                accessibilityLabel="Título do evento"
                theme={inputTheme}
                style={styles.input}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
              />
            </View>
            {titleError && (
              <HelperText type="error" style={{ marginLeft: 55 }}>
                Informe o título do compromisso.
              </HelperText>
            )}
          </Card>
          <Card
            mode="contained"
            style={[
              styles.inputCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View style={[styles.inputRow, { alignItems: "flex-start" }]}>
              <View style={{ paddingTop: 9 }}>
                <IconTile icon="format-align-left" />
              </View>
              <TextInput
                label="Descrição"
                value={draft.description}
                onChangeText={(value) => update("description", value)}
                maxLength={500}
                multiline
                accessibilityLabel="Descrição"
                theme={inputTheme}
                style={styles.input}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
              />
            </View>
          </Card>
          <DateTimeField
            label="Data"
            value={draft.date}
            mode="date"
            onChange={(value) => update("date", value)}
          />
          <View style={styles.timeFields}>
            <View style={{ flex: 1 }}>
              <DateTimeField
                label="Início"
                value={draft.startTime || "09:00"}
                mode="time"
                disabled={draft.allDay}
                onChange={(value) => update("startTime", value)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <DateTimeField
                label="Fim"
                value={draft.endTime || "10:00"}
                mode="time"
                disabled={draft.allDay}
                onChange={(value) => update("endTime", value)}
              />
            </View>
          </View>
          {timeError && (submitted || dirty) && (
            <HelperText type="error">
              O horário final deve ser posterior ao início, no mesmo dia.
            </HelperText>
          )}
          <Card
            mode="contained"
            style={[
              styles.categoryCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View style={styles.categoryHeading}>
              <IconTile icon="tag-outline" size={34} />
              <Text
                style={{ color: theme.colors.onSurfaceVariant, fontSize: 13 }}
              >
                Categoria
              </Text>
            </View>
            <View style={styles.categories}>
              {categories.map((category) => (
                <CategoryChip
                  key={category.id}
                  category={category.id}
                  selected={draft.category === category.id}
                  onPress={() => update("category", category.id)}
                />
              ))}
            </View>
          </Card>
          <Card
            mode="contained"
            style={[
              styles.inputCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View style={styles.inputRow}>
              <IconTile icon="map-marker-outline" />
              <TextInput
                label="Local ou link"
                value={draft.location}
                onChangeText={(value) => update("location", value)}
                maxLength={300}
                autoCapitalize="sentences"
                accessibilityLabel="Local ou link"
                theme={inputTheme}
                style={styles.input}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
              />
            </View>
          </Card>
          <FieldCard
            label="Lembrete"
            value={reminderLabel(draft.reminderMinutes)}
            icon="bell-outline"
            onPress={() => setReminderVisible(true)}
          />
          <Card
            mode="contained"
            style={[
              styles.categoryCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View style={styles.inputRow}>
              <IconTile
                icon="calendar-blank-outline"
                color={theme.colors.secondary}
              />
              <Text style={{ flex: 1, fontSize: 14 }}>Evento o dia todo</Text>
              <Switch
                value={draft.allDay}
                onValueChange={(value) => {
                  setDraft((current) => ({
                    ...current,
                    allDay: value,
                    startTime: current.startTime || "09:00",
                    endTime: current.endTime || "10:00",
                  }));
                }}
                accessibilityLabel="Evento o dia todo"
              />
            </View>
          </Card>
          <Card
            mode="contained"
            style={[
              styles.inputCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View style={[styles.inputRow, { alignItems: "flex-start" }]}>
              <View style={{ paddingTop: 9 }}>
                <IconTile icon="note-text-outline" />
              </View>
              <TextInput
                label="Observações"
                value={draft.notes}
                onChangeText={(value) => update("notes", value)}
                maxLength={1000}
                multiline
                accessibilityLabel="Observações"
                theme={inputTheme}
                style={styles.input}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
              />
            </View>
          </Card>
          <Card
            mode="contained"
            style={[
              styles.inputCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View style={styles.inputRow}>
              <IconTile icon="account-group-outline" />
              <TextInput
                label="Participantes"
                value={participantText}
                onChangeText={setParticipantText}
                maxLength={500}
                placeholder="Separe os nomes por vírgula"
                accessibilityLabel="Participantes"
                theme={inputTheme}
                style={styles.input}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
              />
            </View>
          </Card>
          <Text
            style={{
              fontSize: 11,
              color: theme.colors.onSurfaceVariant,
              lineHeight: 17,
              paddingHorizontal: 4,
            }}
          >
            O alerta aparece enquanto a agenda estiver aberta em primeiro plano.
            {draft.allDay
              ? " Para eventos de dia inteiro, o lembrete considera o início do dia, às 00:00."
              : ""}
          </Text>
          <Button
            mode="contained"
            icon="calendar-plus"
            onPress={save}
            contentStyle={{ minHeight: 53 }}
            style={{ borderRadius: 18, marginTop: 5 }}
            labelStyle={{ fontSize: 15, fontWeight: "700" }}
          >
            {appointment ? "Salvar alterações" : "Salvar compromisso"}
          </Button>
        </View>
      </ScrollView>
      <Portal>
        <Dialog
          visible={reminderVisible}
          onDismiss={() => setReminderVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Lembrete do compromisso</Dialog.Title>
          <Dialog.Content>
            {reminderOptions.map((option) => (
              <RadioButton.Item
                key={String(option.value)}
                label={option.label}
                value={String(option.value)}
                status={
                  draft.reminderMinutes === option.value
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => {
                  update("reminderMinutes", option.value);
                  setReminderVisible(false);
                }}
                labelStyle={{ fontSize: 14 }}
              />
            ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setReminderVisible(false)}>Fechar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fields: { gap: 12 },
  inputCard: {
    borderRadius: 19,
    paddingHorizontal: 13,
    paddingVertical: 5,
    overflow: "hidden",
  },
  inputRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 2,
    minHeight: 62,
    backgroundColor: "transparent",
  },
  timeFields: { flexDirection: "row", gap: 10 },
  categoryCard: { borderRadius: 19, padding: 13 },
  categoryHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  categories: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  dialog: { width: "90%", maxWidth: 420, alignSelf: "center" },
});
