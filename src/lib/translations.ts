import en from "../../messages/en.json";
import ru from "../../messages/ru.json";
import uz from "../../messages/uz.json";

export const messages = { uz, ru, en } as const;
export type Language = keyof typeof messages;
export type Messages = typeof uz;

export function translate(dictionary: Messages, key: string): string {
  return key.split(".").reduce<unknown>((value, part) =>
    value && typeof value === "object" ? (value as Record<string, unknown>)[part] : undefined, dictionary) as string ?? key;
}
