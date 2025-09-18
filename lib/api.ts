import { API_PATHS, DEFAULT_TRANSLATION, versesBaseUrl } from "@/constants";
import type {
  ApiResponse,
  Verse,
  Chapter,
  ApiError,
  Reciter,
  AudioFile,
  Tafsir,
  TafsirText,
} from "@/types/quran";

const API_BASE_URL = "https://api.quran.com/api/v4";

// Common headers for API requests
const getHeaders = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
});

// Generic API error handler
const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      type: "client_error",
      success: false,
    };
  }
  return {
    message: "An unexpected error occurred",
    type: "unknown_error",
    success: false,
  };
};

// Fetch verses by chapter with error handling
export const fetchVersesByChapter = async (
  chapterNumber: number,
  page = 1,
  perPage = 5,
  translations = DEFAULT_TRANSLATION // Default English translation
): Promise<ApiResponse<Verse> | ApiError> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      translations: translations,
      language: "en",
      words: "true",
      translation_fields: "resource_name,language_id",
      fields: "text_uthmani,chapter_id,hizb_number,text_imlaei_simple",
      word_translation_language: "en",
      word_fields:
        "verse_key,verse_id,page_number,location,text_uthmani,text_imlaei_simple,code_v1,qpc_uthmani_hafs",
      mushaf: "2",
      audio: "7", // Default reciter ID
    });

    const url = `${API_BASE_URL}${
      API_PATHS.VERSES_BY_CHAPTER
    }/${chapterNumber}?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      return {
        message: `Failed to fetch verses: ${response.statusText}`,
        type: "api_error",
        success: false,
      };
    }

    const data = await response.json();

    if (data.verses) {
      data.verses = data.verses.map((verse: any) => ({
        ...verse,
        translations: verse.translations || [],
        audio: verse.audio?.url
          ? {
              url: `${versesBaseUrl}${verse.audio.url}`,
              duration: 0,
              format: "mp3",
            }
          : null,
        words:
          verse.words?.map((word: any) => ({
            ...word,
            audio_url: word.audio_url
              ? `https://audio.qurancdn.com/${word.audio_url}`
              : null,
            translation: word.translation || {
              text: "",
              language_name: "English",
              language_id: 38,
            },
            transliteration: word.transliteration || {
              text: null,
              language_name: "English",
              language_id: 38,
            },
          })) || [],
      }));
    }

    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch chapters list
export const fetchChapters = async (): Promise<
  ApiResponse<Chapter> | ApiError
> => {
  try {
    const url = `${API_BASE_URL}${API_PATHS.CHAPTERS}?language=en`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      return {
        message: `Failed to fetch chapters: ${response.statusText}`,
        type: "api_error",
        success: false,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch specific verse by key
export const fetchVerseByKey = async (
  verseKey: string,
  translations = DEFAULT_TRANSLATION
): Promise<ApiResponse<Verse> | ApiError> => {
  try {
    const url = `${API_BASE_URL}${API_PATHS.VERSES_BY_KEY}/${verseKey}?translations=${translations}&language=en&words=true`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      return {
        message: `Failed to fetch verse: ${response.statusText}`,
        type: "api_error",
        success: false,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchReciters = async (): Promise<
  { reciters: Reciter[] } | ApiError
> => {
  try {
    const url = `https://quran.com/api/proxy/content/api/qdc/audio/reciters?locale=en`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      return {
        message: `Failed to fetch reciters: ${response.statusText}`,
        type: "api_error",
        success: false,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchChapterAudio = async (
  chapterId: number,
  reciterId = 7
): Promise<AudioFile | ApiError> => {
  try {
    const url = `https://quran.com/api/proxy/content/api/qdc/audio/reciters/${reciterId}/audio_files?chapter=${chapterId}&segments=true`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      return {
        message: `Failed to fetch chapter audio: ${response.statusText}`,
        type: "api_error",
        success: false,
      };
    }

    const data = await response.json();
    return data.audio_files[0]; // Return first audio file
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchTafsirs = async (
  language = "en"
): Promise<{ tafsirs: Tafsir[] } | ApiError> => {
  try {
    const url = `https://quran.com/api/proxy/content/api/qdc/resources/tafsirs?language=${language}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      return {
        message: `Failed to fetch tafsirs: ${response.statusText}`,
        type: "api_error",
        success: false,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchTafsirByVerse = async (
  verseKey: string,
  tafsirId = 169 // Default English tafsir
): Promise<{ tafsirs: TafsirText[] } | ApiError> => {
  try {
    const url = `${API_BASE_URL}/tafsirs/${tafsirId}/by_ayah/${verseKey}?language=en`;

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      return {
        message: `Failed to fetch tafsir: ${response.statusText}`,
        type: "api_error",
        success: false,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};
