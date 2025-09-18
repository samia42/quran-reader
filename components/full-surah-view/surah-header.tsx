import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import { Pause, Play, Share, Download } from "lucide-react";

const SurahHeader: FC<{
  chapterName: string;
  chapterNameArabic: string;
  verseCount: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onShare: () => void;
  onDownload: () => void;
}> = ({
  chapterName,
  chapterNameArabic,
  verseCount,
  isPlaying,
  onPlayPause,
  onShare,
  onDownload,
}) => (
  <div className="text-center border-b pb-6">
    <div className="flex items-center justify-center gap-4 mb-4">
      <div className="text-3xl arabic-text text-primary" dir="rtl">
        {chapterNameArabic}
      </div>
      <div className="text-2xl font-bold text-foreground">{chapterName}</div>
    </div>
    <p className="text-sm text-muted-foreground">
      {verseCount} verses • Complete Surah
    </p>

    <div className="flex items-center justify-center gap-3 mt-4">
      <Button
        variant="default"
        size="sm"
        onClick={onPlayPause}
        className="flex items-center gap-2"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        {isPlaying ? "Pause Surah" : "Play Full Surah"}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onShare}
        className="flex items-center gap-2"
      >
        <Share className="h-4 w-4" />
        Share
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onDownload}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Download
      </Button>
    </div>
  </div>
);

export default SurahHeader;
