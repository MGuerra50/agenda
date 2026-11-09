import { useState } from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Dialog,
  IconButton,
  Portal,
  Text,
} from "react-native-paper";
import { CategoryChip } from "../components/CategoryChip";
import { IconTile, InfoRow, pageStyles } from "../components/ui";
import {
  getCategory,
  getCategoryColors,
  reminderLabel,
} from "../constants/categories";
import { useAppTheme } from "../theme/theme";
import { Appointment } from "../types/agenda";
import { dayLabel, initials } from "../utils/dateUtils";

export function AppointmentDetailsScreen({
  appointment,
  onBack,
  onEdit,
  onDelete,
  onMessage,
}: {
  appointment: Appointment;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMessage: (message: string) => void;
}) {
  const theme = useAppTheme();
  const [deleteVisible, setDeleteVisible] = useState(false);
  const category = getCategory(appointment.category);
  const colors = getCategoryColors(appointment.category, theme.dark);
  const isLink = /^https?:\/\/[^\s]+$/i.test(appointment.location);

  async function openLocation() {
    try {
      await Linking.openURL(appointment.location);
    } catch {
      onMessage("Não foi possível abrir o link do local.");
    }
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={pageStyles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={pageStyles.toolbar}>
          <IconButton
            icon="chevron-left"
            mode="contained"
            containerColor={theme.colors.surface}
            onPress={onBack}
            accessibilityLabel="Voltar dos detalhes"
            style={pageStyles.back}
          />
          <Text accessibilityRole="header" style={pageStyles.toolbarTitle}>
            Detalhes do compromisso
          </Text>
          <IconButton
            icon="pencil-outline"
            mode="contained"
            containerColor={theme.colors.surface}
            onPress={onEdit}
            accessibilityLabel="Editar compromisso"
            style={pageStyles.back}
          />
        </View>
        <Card
          mode="elevated"
          elevation={1}
          style={[styles.hero, { backgroundColor: theme.colors.surface }]}
        >
          <View style={[styles.heroContent, { borderLeftColor: colors.color }]}>
            <IconTile
              icon={category.icon}
              color={colors.color}
              tint={colors.tint}
              size={54}
            />
            <View style={{ flex: 1, gap: 7 }}>
              <Text style={styles.eventTitle}>{appointment.title}</Text>
              {appointment.description ? (
                <Text
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    fontSize: 13,
                    lineHeight: 20,
                  }}
                >
                  {appointment.description}
                </Text>
              ) : null}
            </View>
          </View>
        </Card>
        <InfoRow icon="calendar-blank-outline" label="Data">
          {dayLabel(appointment.date, true)}
        </InfoRow>
        <InfoRow
          icon="clock-outline"
          label="Horário"
          color={theme.colors.secondary}
        >
          {appointment.allDay
            ? "Dia inteiro"
            : `${appointment.startTime} às ${appointment.endTime}`}
        </InfoRow>
        <InfoRow
          icon={category.icon}
          label="Categoria"
          color={colors.color}
          tint={colors.tint}
        >
          <CategoryChip category={appointment.category} />
        </InfoRow>
        {appointment.location ? (
          <InfoRow
            icon="map-marker-outline"
            label="Local"
            right={
              isLink ? (
                <IconButton
                  icon="open-in-new"
                  size={21}
                  onPress={openLocation}
                  accessibilityLabel="Abrir link do local"
                  style={{ margin: 0 }}
                />
              ) : undefined
            }
          >
            {appointment.location}
          </InfoRow>
        ) : null}
        <InfoRow icon="bell-outline" label="Lembrete">
          {reminderLabel(appointment.reminderMinutes)}
        </InfoRow>
        {appointment.notes ? (
          <InfoRow icon="note-text-outline" label="Observações">
            <Text style={{ fontSize: 13, lineHeight: 21 }}>
              {appointment.notes}
            </Text>
          </InfoRow>
        ) : null}
        {appointment.participants.length ? (
          <InfoRow icon="account-group-outline" label="Participantes">
            <View style={{ gap: 10, marginTop: 4 }}>
              {appointment.participants.map((name, index) => (
                <View
                  key={name}
                  style={{ flexDirection: "row", alignItems: "center", gap: 9 }}
                >
                  <Avatar.Text
                    size={30}
                    label={initials(name)}
                    style={{
                      backgroundColor: [
                        theme.colors.primaryContainer,
                        colors.tint,
                        theme.colors.surfaceVariant,
                      ][index % 3],
                    }}
                    color={theme.colors.primary}
                    labelStyle={{ fontSize: 11, fontWeight: "600" }}
                  />
                  <Text style={{ fontSize: 13, flex: 1 }}>{name}</Text>
                </View>
              ))}
            </View>
          </InfoRow>
        ) : null}
        <View style={styles.actions}>
          <Button
            mode="contained"
            icon="pencil-outline"
            onPress={onEdit}
            style={styles.action}
            contentStyle={{ minHeight: 49 }}
          >
            Editar
          </Button>
          <Button
            mode="outlined"
            icon="trash-can-outline"
            textColor={theme.colors.error}
            onPress={() => setDeleteVisible(true)}
            style={[styles.action, { borderColor: theme.colors.error }]}
            contentStyle={{ minHeight: 49 }}
          >
            Excluir
          </Button>
        </View>
      </ScrollView>
      <Portal>
        <Dialog
          visible={deleteVisible}
          onDismiss={() => setDeleteVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Icon icon="trash-can-outline" />
          <Dialog.Title>Excluir compromisso?</Dialog.Title>
          <Dialog.Content>
            <Text
              style={{ lineHeight: 22 }}
            >{`“${appointment.title}” será removido da sua agenda.`}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteVisible(false)}>Cancelar</Button>
            <Button
              textColor={theme.colors.error}
              onPress={() => {
                setDeleteVisible(false);
                onDelete();
              }}
            >
              Excluir
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 22, marginBottom: 17 },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 19,
    gap: 15,
    borderLeftWidth: 5,
    borderRadius: 22,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.8,
    lineHeight: 28,
  },
  actions: { flexDirection: "row", gap: 12, marginTop: 13 },
  action: { flex: 1, borderRadius: 17 },
  dialog: { width: "90%", maxWidth: 420, alignSelf: "center" },
});
