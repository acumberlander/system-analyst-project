import { badWords } from "./badWords";

export const containsProfanity = (text: string): boolean => {
  // Convert to lowercase and split into words
  const words = text.toLowerCase().split(/\s+/);
  
  // Check each word against the bad words list
  return words.some(word => {
    // Remove any non-alphanumeric characters from the word
    const cleanWord = word.replace(/[^a-z0-9]/g, "");
    // Check if the clean word exactly matches any bad word
    return badWords.includes(cleanWord);
  });
};
