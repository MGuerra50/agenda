# Pesquisa da biblioteca

## Nome, documentação e licença

- Biblioteca escolhida: React Native Paper, um conjunto de componentes visuais para React Native baseado em Material Design.
- Documentação oficial: https://oss.callstack.com/react-native-paper/docs/guides/getting-started
- Repositório: https://github.com/callstack/react-native-paper
- Licença MIT, que permite uso, modificação e distribuição, observadas suas condições: https://github.com/callstack/react-native-paper/blob/main/LICENSE.md

## Manutenção e última versão

- Mantida pela Callstack com contribuições da comunidade. Fonte: https://github.com/callstack/react-native-paper
- Última versão estável consultada em 09/11/2026: 5.15.4, publicada em 02/11/2026. A biblioteca recebeu atualização nos últimos 12 meses.
- O projeto utiliza a versão 5.15.4. Fonte da publicação: https://github.com/callstack/react-native-paper/releases/tag/v5.15.4
- Página no npm: https://www.npmjs.com/package/react-native-paper

## Popularidade

- Consulta realizada em 09/11/2026.
- Estrelas no GitHub: 14.502. Fonte: https://api.github.com/repos/callstack/react-native-paper
- Downloads no npm: 638.019 no período de 02/11/2026 a 08/11/2026, considerando o pacote inteiro. Fonte: https://api.npmjs.org/downloads/point/last-week/react-native-paper
- Esses números variam conforme a data da consulta.

## Plataformas e compatibilidade com Expo

- O Paper oferece componentes para Android e iOS e pode ser utilizado na Web com React Native Web. Fontes: https://github.com/callstack/react-native-paper e https://oss.callstack.com/react-native-paper/docs/guides/react-native-web
- Funciona no Expo Go com as dependências compatíveis com o SDK. O uso do Paper neste projeto não exige development build. Fonte: https://oss.callstack.com/react-native-paper/docs/guides/getting-started
- A agenda utiliza Expo SDK 57. A documentação consultada indica esse SDK para Expo Go em aparelho físico durante a transição para SDK 58. Fonte: https://docs.expo.dev/more/create-expo/
- Os seletores nativos de data e horário são complementares ao Paper e atendem Android e iOS. Na versão Web da agenda, a seleção utiliza um diálogo do Paper com entrada de data e horário. Fonte do seletor nativo: https://docs.expo.dev/versions/latest/sdk/date-time-picker/

## Instalação e configuração

- Instalação da biblioteca principal: npm install react-native-paper@5.15.4
- Instalação dos módulos complementares compatíveis com o SDK: npx expo install react-native-safe-area-context @expo/vector-icons expo-linear-gradient @react-native-community/datetimepicker expo-font expo-system-ui react-native-web react-dom
- App.tsx envolve a aplicação com SafeAreaProvider e PaperProvider. O tema escolhido é fornecido pela propriedade theme do PaperProvider.
- Os temas ficam em src/theme/theme.ts. Não é necessário adicionar um plugin nativo específico do Paper.
- O app.json utiliza userInterfaceStyle com automatic e registra os plugins complementares expo-font e @react-native-community/datetimepicker. expo-system-ui permite acompanhar a aparência do sistema no Android.
- Fonte da configuração do Paper: https://oss.callstack.com/react-native-paper/docs/guides/getting-started
- Fontes dos módulos complementares: https://docs.expo.dev/versions/latest/sdk/safe-area-context/ e https://docs.expo.dev/versions/latest/sdk/system-ui/ e https://docs.expo.dev/versions/latest/sdk/date-time-picker/ e https://docs.expo.dev/versions/latest/sdk/linear-gradient/

## Principais componentes e recursos

- Card: agrupa informações em cartões com superfície e interação. Fonte: https://oss.callstack.com/react-native-paper/docs/components/Card/Card
- TextInput: oferece campos de texto com rótulos e indicação de erro. Fonte: https://oss.callstack.com/react-native-paper/docs/components/TextInput/TextInput
- Button: apresenta ações em estilos preenchido, contornado ou textual. Fonte: https://oss.callstack.com/react-native-paper/docs/components/Button/Button
- Chip: identifica categorias e permite selecionar opções compactas. Fonte: https://oss.callstack.com/react-native-paper/docs/components/Chip/Chip
- FAB: oferece uma ação de destaque em botão flutuante. Fonte: https://oss.callstack.com/react-native-paper/docs/components/FAB/FAB
- Dialog: apresenta confirmações e escolhas sobre o conteúdo da tela.
- Switch e RadioButton: permitem alternar uma preferência ou selecionar uma opção.
- BottomNavigation.Bar: apresenta a navegação entre as áreas principais.
- PaperProvider: compartilha o tema com os componentes e disponibiliza a estrutura de portais.
- Fonte dos componentes e seus recursos: https://oss.callstack.com/react-native-paper/docs/components/ActivityIndicator

## Personalização da aparência

- O tema pode modificar cores, tipografia e arredondamento. Componentes também aceitam propriedades de estilo e cores específicas.
- A agenda personaliza MD3LightTheme e MD3DarkTheme com azul arroxeado, fundo lavanda, superfícies próprias e categorias em azul, verde, roxo e ciano.
- O PaperProvider atualiza a aparência conforme a seleção de tema claro, escuro ou automático. O modo automático acompanha useColorScheme do React Native.
- Cartões, ícones, botões e navegação recebem estilos próprios para aproximar a interface das referências visuais.
- Fonte: https://oss.callstack.com/react-native-paper/docs/guides/theming

## Pontos positivos e negativos observados

- Positivo: os componentes de formulário, diálogo, cartão e navegação usam a mesma estrutura de tema, permitindo centralizar as cores da agenda.
- Positivo: propriedades como onPress, value e onValueChange permitem conectar as interações diretamente ao estado React.
- Positivo: os tipos da biblioteca ajudam a identificar propriedades e estilos incompatíveis durante o desenvolvimento.
- Negativo: os detalhes visuais das referências exigiram estilos adicionais, pois a aparência padrão segue Material Design.
- Negativo: o Paper não fornece um calendário mensal. Foi necessário montar a grade de datas e suas marcações em CalendarMonth.tsx.
- Negativo: a barra inferior fornece a interface de navegação, mas o histórico entre formulário e detalhes e a confirmação de alterações precisaram ser controlados pelo aplicativo.
- Referências relacionadas às observações: https://oss.callstack.com/react-native-paper/docs/guides/theming e https://oss.callstack.com/react-native-paper/docs/components/BottomNavigation/BottomNavigation

## Comparação com React Native Elements

- React Native Elements também oferece um UI kit, com Button, Card, Input, Chip, Dialog e outros componentes para construir as telas da agenda.
- O Elements permite personalização com ThemeProvider e componentes de @rneui/themed. O Paper utiliza PaperProvider e temas baseados em Material Design.
- Ambos atendem ao problema de reunir componentes visuais reutilizáveis. Para este projeto, o Paper foi escolhido pela combinação de navegação inferior, formulário, cartões, diálogos e temas claro e escuro utilizada na implementação.
- A escolha não elimina a necessidade de estilos próprios nem de construir o calendário, mas permite demonstrar vários componentes da mesma biblioteca ao longo das telas.
- Fontes da alternativa: https://reactnativeelements.com/docs e https://reactnativeelements.com/docs/customizing
- Fontes do Paper: https://oss.callstack.com/react-native-paper/docs/guides/theming e https://oss.callstack.com/react-native-paper/docs/guides/getting-started

# Projeto de exemplo

## Execução

- Minha Agenda permite consultar, cadastrar, editar e excluir compromissos, navegar por datas e configurar a aparência.
- Utilizar Node.js de uma versão suportada: 20.19.4 ou superior na linha 20, 22.13.0 ou superior na linha 22, ou 24.3.0 ou superior na linha 24. Recomendação: Node.js LTS atualizado.
- Abrir um terminal na pasta do projeto e executar npm install.
- Iniciar o projeto com npx expo start.
- No celular, abrir o QR Code com uma versão do Expo Go compatível com SDK 57. Manter o aparelho e o computador na mesma rede para a conexão local.
- Para visualizar no navegador, executar npm run web ou pressionar w no terminal do Expo.
- Os exemplos usam a data atual do aparelho. Compromissos e preferências ficam em memória e retornam aos valores iniciais ao fechar ou recarregar a aplicação.
- Os lembretes mostram um alerta visual na agenda no horário ou na antecedência escolhida, somente com o aplicativo aberto em primeiro plano. A borda e a categoria seguem a cor do compromisso, com as ações Ver compromisso e Fechar.
- Cada lembrete aparece uma vez por sessão. Horários que passaram antes de abrir o aplicativo ou enquanto ele estava em segundo plano não geram avisos retroativos.
- Para eventos de dia inteiro, o lembrete considera o início da data, às 00:00. Não há notificações fora do aplicativo.

## Componentes da biblioteca utilizados

- PaperProvider: App.tsx.
- Card: src/components/AppointmentCard.tsx, src/components/CalendarMonth.tsx, src/components/SettingsSection.tsx, src/components/ui.tsx, src/screens/AppointmentFormScreen.tsx e src/screens/AppointmentDetailsScreen.tsx.
- Chip: src/components/CategoryChip.tsx e src/components/AnimatedFilterChip.tsx.
- TextInput: src/screens/AppointmentFormScreen.tsx, src/components/ProfileDialog.tsx e src/components/DateTimeField.web.tsx.
- Button: src/components/CalendarMonth.tsx, src/components/DateTimeField.tsx, src/components/DateTimeField.web.tsx, src/components/ProfileDialog.tsx, src/components/ReminderDialog.tsx, src/navigation/AppNavigator.tsx e nas telas CalendarScreen.tsx, AppointmentFormScreen.tsx, AppointmentDetailsScreen.tsx e SettingsScreen.tsx em src/screens/.
- FAB: src/components/AddAppointmentButton.tsx, reutilizado em src/screens/CalendarScreen.tsx e src/screens/AppointmentsScreen.tsx.
- Switch: src/screens/AppointmentFormScreen.tsx e src/screens/SettingsScreen.tsx.
- RadioButton e RadioButton.Item: src/screens/SettingsScreen.tsx e src/screens/AppointmentFormScreen.tsx.
- List.Item e List.Icon: src/screens/SettingsScreen.tsx.
- Dialog e Portal: src/components/CalendarMonth.tsx, src/components/DateTimeField.tsx, src/components/DateTimeField.web.tsx, src/components/ProfileDialog.tsx, src/components/ReminderDialog.tsx, src/navigation/AppNavigator.tsx, src/screens/AppointmentDetailsScreen.tsx, src/screens/AppointmentFormScreen.tsx e src/screens/SettingsScreen.tsx.
- IconButton: src/components/CalendarMonth.tsx, src/screens/AppointmentFormScreen.tsx e src/screens/AppointmentDetailsScreen.tsx.
- BottomNavigation.Bar: src/components/AppBottomNavigation.tsx.
- Avatar.Text: src/components/AppHeader.tsx e src/screens/AppointmentDetailsScreen.tsx.
- HelperText: src/screens/AppointmentFormScreen.tsx, src/components/ProfileDialog.tsx e src/components/DateTimeField.web.tsx.
- Snackbar: src/navigation/AppNavigator.tsx.
- TouchableRipple: src/components/CalendarDay.tsx, src/components/AppHeader.tsx e src/components/ui.tsx.
- Divider: src/components/CalendarMonth.tsx e src/screens/SettingsScreen.tsx.
- Icon: src/components/AppHeader.tsx, src/components/AppointmentCard.tsx, src/components/ui.tsx, src/components/AppBottomNavigation.tsx, src/components/AddAppointmentButton.tsx, src/components/AnimatedFilterChip.tsx e src/components/ReminderDialog.tsx.
- Text: nos componentes e telas em src/components/, src/navigation/ e src/screens/.

## Capturas de tela

<img width="1080" height="2340" alt="Screenshot_20261110_063128_Expo Go" src="https://github.com/user-attachments/assets/28a2765b-0f21-48a9-a4af-92324ff6ea41" />

<img width="1080" height="2340" alt="Screenshot_20261110_063222_Expo Go" src="https://github.com/user-attachments/assets/ff862a51-bb46-43be-bdb3-385c9f8065e6" />

<img width="1080" height="2340" alt="Screenshot_20261110_063344_Expo Go" src="https://github.com/user-attachments/assets/27a7b887-e8b0-4ecc-b269-c9ab533413c9" />

<img width="1080" height="2340" alt="Screenshot_20261110_063302_Expo Go" src="https://github.com/user-attachments/assets/9f606632-e1cb-4929-bba4-f31ffc921067" />

<img width="1080" height="2340" alt="Screenshot_20261110_070511_Expo Go" src="https://github.com/user-attachments/assets/08882f37-9794-49de-9715-e752f7635eb2" />

<img width="1080" height="2340" alt="Screenshot_20261110_070527_Expo Go" src="https://github.com/user-attachments/assets/9ab5a358-37d7-49fb-9c78-a34cb5210557" />
