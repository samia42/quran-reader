import { Verse } from "@/types/quran";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { FC } from "react";

const ArabicVerses: FC<{
  verses: Verse[];
  currentVerseIndex: number;
  isPlayingFullSurah: boolean;
  onSelectVerse: (index: number) => void;
}> = ({ verses, currentVerseIndex, isPlayingFullSurah, onSelectVerse }) => (
  <div
    className="arabic-text text-2xl leading-loose text-right p-6 bg-muted/30 rounded-lg border max-h-96 overflow-y-auto"
    dir="rtl"
    style={{
      fontFamily: "Amiri, Scheherazade New, Noto Sans Arabic, serif",
      lineHeight: "2.5",
    }}
  >
    {verses.map((verse, index) => (
      <span key={verse.id} className="inline">
        <span
          className={cn(
            "hover:bg-primary/10 hover:text-primary transition-colors duration-200 cursor-pointer rounded px-1",
            currentVerseIndex === index &&
              isPlayingFullSurah &&
              "bg-primary/20 text-primary"
          )}
          onClick={() => onSelectVerse(index)}
        >
          {verse.text_uthmani}
        </span>
        {index < verses.length - 1 && (
          <span className="mx-2 text-primary/60">
            <Badge variant="outline" className="text-xs mx-2">
              {verse.verse_number}
            </Badge>
          </span>
        )}
      </span>
    ))}
  </div>
);

export default ArabicVerses;
