import { audioByReciterUrl, versesBaseUrl } from "./constants";
import { Verse, Word } from "./types/quran";

// build whole-verse translation by joining word translations
export const wholeVerseTranslation = (words: Word[]) =>
  words
    .map((w) => w?.translation?.text || "")
    .filter(Boolean)
    .join(" ");

// build whole-verse transliteration by joining word transliterations
export const wholeVerseTransliteration = (words: Word[]) =>
  words
    .map((w) => w?.transliteration?.text || "")
    .filter(Boolean)
    .join(" ");

export const getVerseAudioUrl = (verse: Verse): string => {
  if (verse.audio?.url) {
    return verse.audio.url.startsWith("http")
      ? verse.audio.url
      : `${versesBaseUrl}${verse.audio.url}`;
  }

  return `${audioByReciterUrl}${verse.verse_key
    .replace(":", "")
    .padStart(6, "0")}.mp3`;
};
