// Minimal className joiner — no runtime dep. Falsy parts are dropped.
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
