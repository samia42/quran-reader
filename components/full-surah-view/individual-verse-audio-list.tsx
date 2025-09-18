import { Verse } from "@/types/quran";
import { FC } from "react";
import VerseAudioPlayer from "../verse-audio-player";
import { getVerseAudioUrl } from "@/utils";

interface IndividualVerseAudioListProps {
  verses: Verse[];
  chapterName: string;
}

const IndividualVerseAudioList: FC<IndividualVerseAudioListProps> = ({
  verses,
  chapterName,
}) => (
  <div className="space-y-3">
    <h3 className="text-lg font-semibold text-foreground border-b pb-2">
      Individual Verse Audio
    </h3>
    <div className="grid gap-3 max-h-64 overflow-y-auto">
      {verses.map((verse) => (
        <VerseAudioPlayer
          key={verse.id}
          audioUrl={getVerseAudioUrl(verse)}
          title={`${chapterName} - Verse ${verse.verse_number}`}
          className="bg-muted/10"
        />
      ))}
    </div>
  </div>
);

export default IndividualVerseAudioList;
