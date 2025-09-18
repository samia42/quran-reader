import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { Verse } from "@/types/quran";
import { wholeVerseTranslation, wholeVerseTransliteration } from "@/utils";

interface TranslationListProps {
  verses: Verse[];
  isTranslation?: boolean;
}

const TranslationList: FC<TranslationListProps> = ({
  verses,
  isTranslation = true,
}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-foreground border-b pb-2">
      Translation
    </h3>
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {verses.map((verse) => (
        <div
          key={`translation-${verse.id}`}
          className="flex gap-3 p-3 rounded-lg hover:bg-muted/20"
        >
          <Badge variant="secondary" className="text-xs mt-1 flex-shrink-0">
            {verse.verse_number}
          </Badge>
          <div className="flex-1">
            <p className="text-foreground leading-relaxed">
              {isTranslation
                ? wholeVerseTranslation(verse.words ?? [])
                : wholeVerseTransliteration(verse.words ?? [])}
            </p>
            {verse.translations?.[0]?.resource_name && (
              <p className="text-xs text-muted-foreground mt-1 italic">
                — {verse.translations[0].resource_name}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TranslationList;
