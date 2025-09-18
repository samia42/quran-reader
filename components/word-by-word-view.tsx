"use client";

import type { FC } from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Play, Pause, Volume2, AlertCircle } from "lucide-react";
import type { Verse } from "@/types/quran";
import { cn } from "@/lib/utils";
import { wholeVerseTranslation, wholeVerseTransliteration } from "@/utils";

export interface WordByWordViewProps {
  verses: Verse[];
  showTranslation?: boolean;
  showTransliteration?: boolean;
  showWordByWord?: boolean;
  className?: string;
}

const WordByWordView: FC<WordByWordViewProps> = ({
  verses,
  showTranslation = true,
  showTransliteration = false,
  showWordByWord = true,
  className,
}) => {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [audioErrors, setAudioErrors] = useState<Set<string>>(new Set());

  const playWordAudio = async (audioUrl: string, wordId: string) => {
    if (playingAudio === wordId) {
      setPlayingAudio(null);
      return;
    }

    try {
      const fullAudioUrl = audioUrl.startsWith("http")
        ? audioUrl
        : `https://audio.qurancdn.com/${audioUrl}`;

      const audio = new Audio(fullAudioUrl);
      setPlayingAudio(wordId);

      setAudioErrors((prev) => {
        const newSet = new Set(prev);
        newSet.delete(wordId);
        return newSet;
      });

      audio.onended = () => setPlayingAudio(null);
      audio.onerror = (error) => {
        console.error("Audio error:", error);
        setPlayingAudio(null);
        setAudioErrors((prev) => new Set(prev).add(wordId));
      };

      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setPlayingAudio(null);
      setAudioErrors((prev) => new Set(prev).add(wordId));
    }
  };

  if (!verses || verses.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No verses available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {verses.map((verse) => (
        <Card key={verse.id} className="overflow-hidden">
          <CardContent className="p-6">
            {/* Verse Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-sm">
                  {verse.verse_key}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  Juz {verse.juz_number} • Page {verse.page_number}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Hizb {verse.hizb_number} • Ruku {verse.ruku_number}
              </div>
            </div>

            {/* Word-by-Word Interactive Display */}
            {showWordByWord && verse.words && verse.words.length > 0 && (
              <div className="mb-6">
                <div
                  className="flex flex-wrap gap-3 justify-end mb-4 p-6 bg-muted/20 rounded-lg border"
                  dir="rtl"
                >
                  {verse.words.map((word, wordIndex) => {
                    const wordId = `${verse.id}-${wordIndex}`;
                    const isPlaying = playingAudio === wordId;
                    const hasError = audioErrors.has(wordId);

                    return (
                      <Popover key={wordIndex}>
                        <PopoverTrigger asChild>
                          <button
                            className={cn(
                              "arabic-text text-2xl hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg px-3 py-2 cursor-pointer relative group border border-transparent hover:border-primary/20",
                              selectedWord === wordId &&
                                "bg-primary/20 text-primary border-primary/40",
                              isPlaying &&
                                "bg-green-100 text-green-700 border-green-300",
                              hasError && "bg-red-50 border-red-200"
                            )}
                            style={{
                              fontFamily:
                                "Amiri, Scheherazade New, Noto Sans Arabic, serif",
                            }}
                            onClick={() => setSelectedWord(wordId)}
                          >
                            {word.text_uthmani}
                            {word.audio_url && (
                              <div className="absolute -top-1 -right-1">
                                {hasError ? (
                                  <AlertCircle className="w-3 h-3 text-red-500 opacity-60" />
                                ) : (
                                  <Volume2 className="w-3 h-3 text-primary opacity-60 group-hover:opacity-100" />
                                )}
                              </div>
                            )}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="center">
                          <div className="space-y-4">
                            <div className="text-center">
                              <div
                                className="arabic-text text-2xl text-primary mb-3 p-2 bg-primary/5 rounded-lg"
                                dir="rtl"
                                style={{
                                  fontFamily:
                                    "Amiri, Scheherazade New, Noto Sans Arabic, serif",
                                }}
                              >
                                {word.text_uthmani}
                              </div>
                              {showTransliteration &&
                                word.transliteration?.text && (
                                  <div className="text-sm text-muted-foreground italic mb-2 p-2 bg-muted/10 rounded">
                                    <strong>Transliteration:</strong>{" "}
                                    {word.transliteration.text}
                                  </div>
                                )}
                              <div className="text-sm font-medium p-2 bg-muted/10 rounded">
                                <strong>Translation:</strong>{" "}
                                {word.translation?.text ||
                                  "Translation not available"}
                              </div>
                            </div>

                            {word.audio_url && (
                              <div className="flex justify-center">
                                <Button
                                  size="sm"
                                  variant={hasError ? "destructive" : "outline"}
                                  onClick={() =>
                                    playWordAudio(word.audio_url!, wordId)
                                  }
                                  disabled={isPlaying}
                                  className="flex items-center gap-2"
                                >
                                  {isPlaying ? (
                                    <Pause className="h-3 w-3" />
                                  ) : hasError ? (
                                    <AlertCircle className="h-3 w-3" />
                                  ) : (
                                    <Play className="h-3 w-3" />
                                  )}
                                  {isPlaying
                                    ? "Playing..."
                                    : hasError
                                    ? "Audio Error"
                                    : "Pronounce"}
                                </Button>
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    );
                  })}
                </div>

                <div className="text-center text-xs text-muted-foreground bg-muted/10 p-2 rounded">
                  💡 Click words for translation and transliteration • Click
                  play button for audio pronunciation
                </div>
              </div>
            )}

            {/* Full Verse Arabic Text (fallback) */}
            {(!showWordByWord || !verse.words || verse.words.length === 0) && (
              <div
                className="arabic-text text-2xl leading-loose text-right mb-4 p-4 bg-muted/20 rounded-lg"
                dir="rtl"
                style={{
                  fontFamily:
                    "Amiri, Scheherazade New, Noto Sans Arabic, serif",
                  lineHeight: "2.2",
                }}
              >
                {verse.text_uthmani}
              </div>
            )}

            {/* Translation */}
            {showTranslation && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Translation
                </h4>
                <p className="text-foreground leading-relaxed">
                  {wholeVerseTranslation(verse.words ?? [])}
                </p>
                {verse.translations?.[0]?.resource_name && (
                  <p className="text-xs text-muted-foreground italic">
                    — {verse.translations[0].resource_name}
                  </p>
                )}
              </div>
            )}

            {/* Transliteration */}
            {showTransliteration && (
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Transliteration
                </h4>
                <p className="text-foreground leading-relaxed italic">
                  {wholeVerseTransliteration(verse.words ?? [])}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WordByWordView;
