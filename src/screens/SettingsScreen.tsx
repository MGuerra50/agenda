import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  Divider,
  List,
  Portal,
  RadioButton,
  Switch,
  Text,
} from "react-native-paper";
import { ScreenTitle } from "../components/AppHeader";
import { SettingsSection } from "../components/SettingsSection";
import { IconTile, pageStyles } from "../components/ui";
import { reminderLabel, reminderOptions } from "../constants/categories";
import { useAgenda } from "../context/AgendaContext";
import { useAppTheme } from "../theme/theme";
import { Preferences } from "../types/agenda";

const appearances: {
  value: Preferences["appearance"];
  title: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "light",
    title: "Tema claro",
    description: "Uma interface clara e iluminada",
    icon: "white-balance-sunny",
  },
  {
    value: "dark",
    title: "Tema escuro",
    description: "Mais conforto em ambientes com pouca luz",
    icon: "moon-waning-crescent",
  },
  {
    value: "system",
    title: "Automático",
    description: "Acompanha a aparência do seu aparelho",
    icon: "monitor",
  },
];

export function SettingsScreen({ onProfile }: { onProfile: () => void }) {
  const theme = useAppTheme();
  const { preferences, updatePreferences } = useAgenda();
  const [dialog, setDialog] = useState<"reminder" | "week" | null>(null);
  const divider = <Divider style={styles.divider} />;
  const titleStyle = {
    fontSize: 13.5,
    fontWeight: "700" as const,
    color: theme.colors.onSurface,
  };
  const descriptionStyle = {
    fontSize: 10.5,
    lineHeight: 15,
    color: theme.colors.onSurfaceVariant,
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={pageStyles.scroll}
      >
        <ScreenTitle
          title="Configurações"
          subtitle="Deixe sua agenda com a sua cara"
        />
        <SettingsSection title="Aparência" icon="palette-outline">
          {appearances.map((appearance, index) => (
            <View key={appearance.value}>
              <List.Item
                title={appearance.title}
                description={appearance.description}
                titleStyle={titleStyle}
                descriptionStyle={descriptionStyle}
                descriptionNumberOfLines={2}
                style={styles.item}
                onPress={() =>
                  updatePreferences({ appearance: appearance.value })
                }
                left={() => <IconTile icon={appearance.icon} size={35} />}
                right={() => (
                  <RadioButton
                    value={appearance.value}
                    status={
                      preferences.appearance === appearance.value
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() =>
                      updatePreferences({ appearance: appearance.value })
                    }
                  />
                )}
              />
              {index < 2 && divider}
            </View>
          ))}
        </SettingsSection>
        <SettingsSection
          title="Lembretes"
          icon="bell-outline"
          color={theme.colors.secondary}
        >
          <List.Item
            title="Lembrete nos novos eventos"
            description="Ativa o alerta nos próximos cadastros"
            titleStyle={titleStyle}
            descriptionStyle={descriptionStyle}
            descriptionNumberOfLines={2}
            style={styles.item}
            onPress={() =>
              updatePreferences({
                remindersEnabled: !preferences.remindersEnabled,
              })
            }
            left={() => <IconTile icon="calendar-clock" size={35} />}
            right={() => (
              <Switch
                value={preferences.remindersEnabled}
                onValueChange={(remindersEnabled) =>
                  updatePreferences({ remindersEnabled })
                }
                accessibilityLabel="Lembretes nos novos eventos"
              />
            )}
          />
          {divider}
          <List.Item
            title="Antecedência padrão"
            description="Aplicada aos próximos cadastros"
            titleStyle={titleStyle}
            descriptionStyle={descriptionStyle}
            descriptionNumberOfLines={2}
            style={styles.item}
            onPress={() => setDialog("reminder")}
            left={() => (
              <IconTile
                icon="clock-outline"
                size={35}
                color={theme.colors.secondary}
              />
            )}
            right={() => (
              <Button
                compact
                onPress={() => setDialog("reminder")}
                labelStyle={{ fontSize: 10.5, marginHorizontal: 5 }}
              >
                {reminderLabel(preferences.defaultReminder).replace(
                  " antes",
                  "",
                )}
              </Button>
            )}
          />
          <Text style={[styles.note, { color: theme.colors.onSurfaceVariant }]}>
            Os alertas aparecem com a agenda aberta em primeiro plano. Eventos
            já cadastrados mantêm o lembrete escolhido.
          </Text>
        </SettingsSection>
        <SettingsSection
          title="Calendário"
          icon="calendar-month-outline"
          color={theme.dark ? "#D5B0FF" : "#8136D9"}
        >
          <List.Item
            title="Números da semana"
            description="Exibir a numeração ISO no calendário"
            titleStyle={titleStyle}
            descriptionStyle={descriptionStyle}
            descriptionNumberOfLines={2}
            style={styles.item}
            onPress={() =>
              updatePreferences({
                showWeekNumbers: !preferences.showWeekNumbers,
              })
            }
            left={() => <IconTile icon="pound" size={35} />}
            right={() => (
              <Switch
                value={preferences.showWeekNumbers}
                onValueChange={(showWeekNumbers) =>
                  updatePreferences({ showWeekNumbers })
                }
                accessibilityLabel="Mostrar números da semana"
              />
            )}
          />
          {divider}
          <List.Item
            title="Início da semana"
            description="Escolha o primeiro dia da grade"
            titleStyle={titleStyle}
            descriptionStyle={descriptionStyle}
            descriptionNumberOfLines={2}
            style={styles.item}
            onPress={() => setDialog("week")}
            left={() => <IconTile icon="calendar-week" size={35} />}
            right={() => (
              <Button
                compact
                onPress={() => setDialog("week")}
                labelStyle={{ fontSize: 10.5, marginHorizontal: 5 }}
              >
                {preferences.weekStartsOn === 0 ? "Domingo" : "Segunda"}
              </Button>
            )}
          />
        </SettingsSection>
        <SettingsSection title="Sua agenda" icon="account-outline">
          <List.Item
            title="Perfil local"
            description="Personalize seu nome e suas iniciais"
            titleStyle={titleStyle}
            descriptionStyle={descriptionStyle}
            descriptionNumberOfLines={2}
            style={styles.item}
            onPress={onProfile}
            left={() => (
              <IconTile
                icon="account-outline"
                size={35}
                color={theme.colors.secondary}
              />
            )}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </SettingsSection>
      </ScrollView>
      <Portal>
        <Dialog
          visible={dialog === "reminder"}
          onDismiss={() => setDialog(null)}
          style={styles.dialog}
        >
          <Dialog.Title>Antecedência padrão</Dialog.Title>
          <Dialog.Content>
            {reminderOptions
              .filter((option) => option.value !== null)
              .map((option) => (
                <RadioButton.Item
                  key={String(option.value)}
                  label={option.label}
                  value={String(option.value)}
                  status={
                    preferences.defaultReminder === option.value
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => {
                    updatePreferences({ defaultReminder: option.value! });
                    setDialog(null);
                  }}
                  labelStyle={{ fontSize: 14 }}
                />
              ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialog(null)}>Fechar</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={dialog === "week"}
          onDismiss={() => setDialog(null)}
          style={styles.dialog}
        >
          <Dialog.Title>Início da semana</Dialog.Title>
          <Dialog.Content>
            {(
              [
                { value: 0, title: "Domingo" },
                { value: 1, title: "Segunda-feira" },
              ] as const
            ).map((option) => (
              <RadioButton.Item
                key={option.value}
                value={String(option.value)}
                label={option.title}
                status={
                  preferences.weekStartsOn === option.value
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => {
                  updatePreferences({ weekStartsOn: option.value });
                  setDialog(null);
                }}
              />
            ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialog(null)}>Fechar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  item: { paddingVertical: 3, paddingHorizontal: 3 },
  divider: { marginLeft: 49, marginRight: 5 },
  note: {
    fontSize: 10.5,
    lineHeight: 16,
    marginHorizontal: 7,
    marginTop: 5,
    marginBottom: 5,
  },
  footer: { fontSize: 11, textAlign: "center", lineHeight: 18, paddingTop: 5 },
  dialog: { width: "90%", maxWidth: 420, alignSelf: "center" },
});
