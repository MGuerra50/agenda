import { CategoryId } from "../types/agenda";

export const categories = [
  {
    id: "trabalho",
    label: "Trabalho",
    icon: "briefcase-outline",
    color: "#00856F",
    tint: "#E0F6EE",
    darkColor: "#66E0BD",
    darkTint: "#123D34",
  },
  {
    id: "faculdade",
    label: "Faculdade",
    icon: "school-outline",
    color: "#3046DE",
    tint: "#E9EDFF",
    darkColor: "#ADB9FF",
    darkTint: "#292E57",
  },
  {
    id: "pessoal",
    label: "Pessoal",
    icon: "heart-outline",
    color: "#8238C5",
    tint: "#F0E6FC",
    darkColor: "#D8B1FF",
    darkTint: "#3E2855",
  },
  {
    id: "saude",
    label: "Saúde",
    icon: "medical-bag",
    color: "#00859A",
    tint: "#DFF4F7",
    darkColor: "#77D9E9",
    darkTint: "#153B43",
  },
] as const;

export function getCategory(id: CategoryId) {
  return categories.find((category) => category.id === id) ?? categories[0];
}

export function getCategoryColors(id: CategoryId, dark: boolean) {
  const category = getCategory(id);
  return {
    color: dark ? category.darkColor : category.color,
    tint: dark ? category.darkTint : category.tint,
  };
}

export const reminderOptions = [
  { value: null, label: "Sem lembrete" },
  { value: 0, label: "No horário" },
  { value: 5, label: "5 min antes" },
  { value: 15, label: "15 min antes" },
  { value: 30, label: "30 min antes" },
  { value: 60, label: "1 hora antes" },
];

export function reminderLabel(value: number | null) {
  return (
    reminderOptions.find((option) => option.value === value)?.label ??
    "Sem lembrete"
  );
}
