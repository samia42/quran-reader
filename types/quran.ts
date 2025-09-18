export interface Verse {
  id: number
  chapter_id?: number
  verse_number: number
  verse_key: string
  text_uthmani?: string
  text_uthmani_simple?: string
  text_imlaei?: string
  juz_number: number
  hizb_number: number
  rub_el_hizb_number: number
  ruku_number: number
  manzil_number: number
  sajdah_number: number | null
  page_number: number
  words: Word[]
  translations?: Translation[]
  audio?: Audio
}

export interface Translation {
  resource_id: number
  resource_name: string
  text: string
  language_name: string
}

export interface Audio {
  url: string
  duration: number
  format: string
}

export interface Word {
  id: number
  position: number
  audio_url: string | null
  verse_key: string
  verse_id: number
  location: string
  text_uthmani: string // Proper Arabic text
  text_imlaei_simple: string // Simplified Arabic text
  code_v1: string // QPC code
  qpc_uthmani_hafs: string // Hafs script
  char_type_name: string
  page_number: number
  line_number: number
  text: string // This was showing wrong characters
  translation: {
    text: string
    language_name: string
    language_id: number
  }
  transliteration: {
    text: string | null
    language_name: string
    language_id: number
  }
}

export interface Chapter {
  id: number
  name_simple: string
  name_arabic: string
  name_complex: string
  revelation_place: string
  verses_count: number
  bismillah_pre: boolean
}

export interface ApiResponse<T> {
  verses?: T[]
  chapters?: T[]
  pagination?: {
    per_page: number
    current_page: number
    next_page: number | null
    total_pages: number
    total_records: number
  }
}

export interface ApiError {
  message: string
  type: string
  success: boolean
}

export type ViewingMode = "verse" | "word" | "full"

export interface ViewingOptions {
  mode: ViewingMode
  showTranslation: boolean
  showTransliteration: boolean
  showWordByWord: boolean
}

export interface Reciter {
  id: number
  reciter_id: number
  name: string
  translated_name: {
    name: string
    language_name: string
  }
  style: {
    name: string
    language_name: string
    description: string
  }
  qirat: {
    name: string
    language_name: string
  }
}

export interface AudioFile {
  id: number
  chapter_id: number
  file_size: number
  format: string
  audio_url: string
  duration: number
  verse_timings: VerseTimings[]
}

export interface VerseTimings {
  verse_key: string
  timestamp_from: number
  timestamp_to: number
  duration: number
  segments: number[][]
}

export interface Tafsir {
  id: number
  name: string
  author_name: string | null
  slug: string
  language_name: string
  translated_name: {
    name: string
    language_name: string
  }
}

export interface TafsirText {
  id: number
  verse_id: number
  verse_key: string
  text: string
  resource_id: number
  resource_name: string
  language_name: string
}
