"use client";

import type { FC } from "react";
import { useState, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { Card, CardContent } from "@/components/ui/card";
import type { Verse } from "@/types/quran";
import { cn } from "@/lib/utils";
import IndividualVerseAudioList from "./individual-verse-audio-list";
import TranslationList from "./translation-list";
import ArabicVerses from "./arabic-verses";
import SurahHeader from "./surah-header";
import { getVerseAudioUrl } from "@/utils";

export interface FullSurahViewProps {
  verses: Verse[];
  chapterName: string;
  chapterNameArabic: string;
  showTranslation?: boolean;
  showTransliteration?: boolean;
  className?: string;
}

const FullSurahView: FC<FullSurahViewProps> = ({
  verses,
  chapterName,
  chapterNameArabic,
  showTranslation = true,
  showTransliteration = false,
  className,
}) => {
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!verses || verses.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No verses available</p>
        </CardContent>
      </Card>
    );
  }

  const playFullSurah = async () => {
    if (isPlayingFullSurah) {
      setIsPlayingFullSurah(false);
      audioRef.current?.pause();
      audioRef.current = null;
      return;
    }

    setIsPlayingFullSurah(true);
    setCurrentVerseIndex(0);

    const playNextVerse = (index: number) => {
      if (index >= verses.length) {
        setIsPlayingFullSurah(false);
        setCurrentVerseIndex(0);
        return;
      }

      setCurrentVerseIndex(index);
      const verse = verses[index];
      const url = getVerseAudioUrl(verse);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => playNextVerse(index + 1);
      audio.onerror = () => playNextVerse(index + 1);
      audio.play().catch(() => playNextVerse(index + 1));
    };

    playNextVerse(0);
  };

  const shareFullSurah = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Listen to ${chapterName}`,
          text: `Listen to the complete Surah ${chapterName}`,
          url: window.location.href,
        })
        .catch((err) => console.error("Share failed:", err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const downloadFullSurah = async () => {
    const zip = new JSZip();
    for (const verse of verses) {
      try {
        const response = await fetch(getVerseAudioUrl(verse));
        const blob = await response.blob();
        zip.file(`${chapterName}-verse-${verse.verse_number}.mp3`, blob);
      } catch (error) {
        console.error(`Failed to fetch verse ${verse.verse_number}`, error);
      }
    }
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${chapterName}-complete-surah.zip`);
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6 space-y-6">
        <SurahHeader
          chapterName={chapterName}
          chapterNameArabic={chapterNameArabic}
          verseCount={verses.length}
          isPlaying={isPlayingFullSurah}
          onPlayPause={playFullSurah}
          onShare={shareFullSurah}
          onDownload={downloadFullSurah}
        />

        <ArabicVerses
          verses={verses}
          currentVerseIndex={currentVerseIndex}
          isPlayingFullSurah={isPlayingFullSurah}
          onSelectVerse={setCurrentVerseIndex}
        />

        {showTransliteration && (
          <TranslationList verses={verses} isTranslation={false} />
        )}
        {showTranslation && <TranslationList verses={verses} />}
        <IndividualVerseAudioList verses={verses} chapterName={chapterName} />
      </CardContent>
    </Card>
  );
};

export default FullSurahView;
