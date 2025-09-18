"use client";

import { type FC, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Play, Pause, Volume2, BookOpen, Hash, MapPin } from "lucide-react";
import type { Verse, Word } from "@/types/quran";
import { cn } from "@/lib/utils";
import { versesBaseUrl } from "@/constants";

export interface InteractiveVerseCardProps {
  verse: Verse;
  className?: string;
  showTranslation?: boolean;
}

const InteractiveVerseCard: FC<InteractiveVerseCardProps> = ({
  verse,
  className,
  showTranslation = true,
}) => {
  const [currentPlayingWord, setCurrentPlayingWord] = useState<number | null>(
    null
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleWordAudioPlay = async (word: Word) => {
    if (!word.audio_url) return;

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setCurrentPlayingWord(word.position);

    try {
      const audio = new Audio(`${versesBaseUrl}${word.audio_url}`);
      audioRef.current = audio;

      audio.addEventListener("ended", () => {
        setCurrentPlayingWord(null);
        audioRef.current = null;
      });

      audio.addEventListener("error", () => {
        setCurrentPlayingWord(null);
        audioRef.current = null;
      });

      await audio.play();
    } catch (error) {
      console.error("Error playing word audio:", error);
      setCurrentPlayingWord(null);
    }
  };

  const renderWord = (word: Word) => {
    if (word.char_type_name === "end") {
      return (
        <span key={word.id} className="inline-block mx-1">
          <Badge variant="outline" className="metadata-badge text-xs">
            {verse.verse_number}
          </Badge>
        </span>
      );
    }

    const isPlaying = currentPlayingWord === word.position;
    const arabicText = word.text_uthmani || word.qpc_uthmani_hafs || word.text;

    return (
      <Popover key={word.id}>
        <PopoverTrigger asChild>
          <span
            className={cn(
              "arabic-word cursor-pointer inline-block mx-1 px-1 py-0.5 rounded transition-colors",
              isPlaying && "bg-primary/20 text-primary",
              "hover:bg-accent/20 focus:bg-accent/30 focus:outline-none focus:ring-2 focus:ring-ring"
            )}
            onDoubleClick={() => handleWordAudioPlay(word)}
            role="button"
            tabIndex={0}
            aria-label={`Word: ${arabicText}, Translation: ${word.translation.text}`}
          >
            {arabicText}
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" side="top">
          <div className="space-y-3">
            <div className="text-center">
              <div className="arabic-text text-2xl mb-2" dir="rtl">
                {arabicText}
              </div>
              {word.transliteration.text && (
                <div className="transliteration-text text-sm text-muted-foreground italic">
                  {word.transliteration.text}
                </div>
              )}
            </div>

            <div className="border-t pt-3">
              <p className="font-medium text-sm text-foreground mb-1">
                Translation:
              </p>
              <p className="text-sm text-muted-foreground">
                {word.translation.text}
              </p>
            </div>

            {word.audio_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWordAudioPlay(word)}
                className="w-full flex items-center gap-2"
                disabled={isPlaying}
              >
                {isPlaying ? (
                  <Pause className="h-3 w-3" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
                {isPlaying ? "Playing..." : "Listen"}
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const arabicText = verse.words
    ?.filter(
      (word) => word.char_type_name === "word" || word.char_type_name === "end"
    )
    .map(renderWord);

  return (
    <Card className={cn("w-full verse-card", className)}>
      <CardContent className="p-6 space-y-6">
        {/* Enhanced verse metadata */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              {verse.verse_key}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              Juz {verse.juz_number}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Page {verse.page_number}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Hizb {verse.hizb_number}</span>
            <span>•</span>
            <span>Ruku {verse.ruku_number}</span>
          </div>
        </div>

        {/* Interactive Arabic text with word-by-word */}
        <div className="text-right leading-loose p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border">
          <div
            className="arabic-text text-2xl leading-relaxed"
            dir="rtl"
            style={{ fontFamily: "Amiri, Scheherazade, serif" }}
          >
            {arabicText}
          </div>
        </div>

        {/* Translation section */}
        {showTranslation && verse.translations?.[0] && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs text-muted-foreground px-2">
                Translation
              </span>
              <div className="h-px bg-border flex-1" />
            </div>
            <div className="text-foreground leading-relaxed">
              <p className="text-balance">{verse.translations[0].text}</p>
              {verse.translations[0].resource_name && (
                <p className="text-xs text-muted-foreground mt-2 italic">
                  — {verse.translations[0].resource_name}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Enhanced audio controls */}
        {verse.audio?.url && (
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                /* Handle full verse audio */
              }}
              className="flex items-center gap-2"
              aria-label="Play full verse recitation"
            >
              <Volume2 className="h-4 w-4" />
              Play Full Verse
            </Button>

            <div className="text-xs text-muted-foreground">
              Double-click any word to hear its pronunciation
            </div>
          </div>
        )}

        {/* Usage hint */}
        <div className="text-xs text-muted-foreground text-center p-2 bg-muted/20 rounded">
          💡 Click words for translation • Double-click for audio pronunciation
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveVerseCard;
