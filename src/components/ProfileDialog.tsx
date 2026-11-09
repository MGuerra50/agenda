import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  HelperText,
  Portal,
  TextInput,
} from "react-native-paper";
import { useAgenda } from "../context/AgendaContext";

export function ProfileDialog({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) {
  const { preferences, updatePreferences } = useAgenda();
  const [name, setName] = useState(preferences.profileName);
  useEffect(() => {
    if (visible) setName(preferences.profileName);
  }, [visible, preferences.profileName]);
  const valid = name.trim().length > 0;
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onDismiss}
        style={{ width: "90%", maxWidth: 420, alignSelf: "center" }}
      >
        <Dialog.Title>Seu perfil</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Nome"
            mode="outlined"
            value={name}
            onChangeText={setName}
            maxLength={60}
            autoCapitalize="words"
            accessibilityLabel="Nome do perfil"
            error={!valid}
          />
          <HelperText type={valid ? "info" : "error"}>
            {valid
              ? "Seu nome e suas iniciais aparecem no cabeçalho."
              : "Informe seu nome."}
          </HelperText>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancelar</Button>
          <Button
            disabled={!valid}
            onPress={() => {
              updatePreferences({ profileName: name.trim() });
              onDismiss();
            }}
          >
            Salvar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
