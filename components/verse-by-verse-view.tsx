"use client";

import type { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import VerseAudioPlayer from "./verse-audio-player";
import type { Verse } from "@/types/quran";
import { cn } from "@/lib/utils";
import {
  getVerseAudioUrl,
  wholeVerseTranslation,
  wholeVerseTransliteration,
} from "@/utils";
import { audioByReciterUrl, versesBaseUrl } from "@/constants";

export interface VerseByVerseViewProps {
  verses: Verse[];
  showTranslation?: boolean;
  showTransliteration?: boolean; // Added transliteration support
  selectedVerse?: number | null;
  onVerseSelect?: (verseId: number) => void;
  className?: string;
}

const VerseByVerseView: FC<VerseByVerseViewProps> = ({
  verses,
  showTranslation = true,
  showTransliteration = false, // Added transliteration support
  selectedVerse,
  onVerseSelect,
  className,
}) => {
  const [playingVerse, setPlayingVerse] = useState<number | null>(null);

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
        <Card
          key={verse.id}
          className={cn(
            "overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md",
            selectedVerse === verse.id && "ring-2 ring-primary shadow-lg"
          )}
          onClick={() => onVerseSelect?.(verse.id)}
        >
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

            {/* Arabic Text */}
            <div
              className="arabic-text text-2xl leading-loose text-right mb-6 p-4 bg-muted/20 rounded-lg"
              dir="rtl"
              style={{
                fontFamily: "Amiri, Scheherazade New, Noto Sans Arabic, serif",
                lineHeight: "2.2",
              }}
            >
              {verse.text_uthmani}
            </div>

            {/* Transliteration */}
            {showTransliteration && (
              <div className="mb-4 p-3 bg-muted/10 rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Transliteration
                </h4>
                <p className="text-foreground leading-relaxed italic">
                  {wholeVerseTransliteration(verse.words ?? [])}
                </p>
              </div>
            )}

            {/* Translation */}
            {showTranslation && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Translation
                </h4>
                <p className="text-foreground leading-relaxed">
                  {wholeVerseTranslation(verse.words ?? [])}
                </p>
                {verse.translations?.[0]?.resource_name && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    — {verse.translations[0].resource_name}
                  </p>
                )}
              </div>
            )}

            {/* Audio Player */}
            <div className="mt-4 pt-4 border-t">
              <VerseAudioPlayer
                audioUrl={getVerseAudioUrl(verse)}
                title={`Verse ${verse.verse_number}`}
                onPlay={() => setPlayingVerse(verse.id)}
                onPause={() => setPlayingVerse(null)}
                onEnded={() => setPlayingVerse(null)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VerseByVerseView;
