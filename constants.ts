export const VERSES_PER_PAGE = 10;

export const DEFAULT_TRANSLATION = "131";

export enum API_PATHS {
  VERSES_BY_CHAPTER = "/verses/by_chapter",
  VERSES_BY_KEY = "/verses/by_key",
  CHAPTERS = "/chapters",
}

export const versesBaseUrl = `${process.env.NEXT_PUBLIC_QURAN_VERSES}/`;
export const audioByReciterUrl = `${versesBaseUrl}/Alafasy/mp3/`;
