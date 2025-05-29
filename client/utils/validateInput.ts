import { badWords } from "./badWords";

export const containsProfanity = (text: string): boolean => {
  const lower = text.toLowerCase();
  return badWords.some((word) => lower.includes(word));
};

export const validateStudentInput = (input: {
  name: string;
  email: string;
  program: string;
  startTerm: string;
}): string | null => {
  if (!input.name || !input.email || !input.program || !input.startTerm) {
    return "All fields are required.";
  }

  for (const [key, value] of Object.entries(input)) {
    if (containsProfanity(value)) {
      return `Inappropriate language detected in ${key}.`;
    }
  }

  return null; // valid
};
