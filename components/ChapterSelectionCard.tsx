import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import ErrorMessage from "@/components/error-message";
import ChapterSelector from "@/components/chapter-selector";

interface Props {
  chapters: any[];
  selectedChapter: number;
  selectedChapterInfo?: any;
  loading: boolean;
  error: boolean;
  errorData: any;
  refetch: () => void;
  onChapterChange: (id: number) => void;
}

export default function ChapterSelectionCard({
  chapters,
  selectedChapter,
  selectedChapterInfo,
  loading,
  error,
  errorData,
  refetch,
  onChapterChange,
}: Props) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Select Surah
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && errorData ? (
          <ErrorMessage error={errorData} onRetry={refetch} />
        ) : (
          <ChapterSelector
            chapters={chapters || []}
            selectedChapter={selectedChapter}
            onChapterChange={onChapterChange}
            isLoading={loading}
          />
        )}

        {selectedChapterInfo && (
          <div className="mt-4 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground text-lg">
                  {selectedChapterInfo.name_simple}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedChapterInfo.verses_count} verses •{" "}
                  {selectedChapterInfo.revelation_place}
                </p>
              </div>
              <div
                className="arabic-text text-2xl text-primary"
                dir="rtl"
                style={{ fontFamily: "Amiri, Scheherazade, serif" }}
              >
                {selectedChapterInfo.name_arabic}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
