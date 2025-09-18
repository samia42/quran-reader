import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LoadingSkeleton from "@/components/loading-skeleton";
import ErrorMessage from "@/components/error-message";
import FullSurahView from "@/components/full-surah-view/full-surah-view";
import VerseByVerseView from "@/components/verse-by-verse-view";
import WordByWordView from "@/components/word-by-word-view";

interface VerseRendererProps {
  viewingOptions: any;
  selectedChapterInfo?: any;
  versesQuery: any;
  fullSurahQuery: any;
  selectedVerse: number | null;
  setSelectedVerse: (id: number | null) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function VerseRenderer({
  viewingOptions,
  selectedChapterInfo,
  versesQuery,
  fullSurahQuery,
  selectedVerse,
  setSelectedVerse,
  currentPage,
  setCurrentPage,
}: VerseRendererProps) {
  const { verses, isLoading, isError, error, pagination, refetch } =
    versesQuery;
  const {
    verses: fullSurahVerses,
    isLoading: fullSurahLoading,
    isError: fullSurahError,
    error: fullSurahErrorData,
    refetch: refetchFullSurah,
  } = fullSurahQuery;

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.total_pages)
      setCurrentPage(currentPage + 1);
  };

  // --- FULL SURAH MODE ---
  if (viewingOptions.mode === "full") {
    if (fullSurahError && fullSurahErrorData) {
      return (
        <ErrorMessage error={fullSurahErrorData} onRetry={refetchFullSurah} />
      );
    }
    if (fullSurahLoading) return <LoadingSkeleton count={1} />;

    if (fullSurahVerses && fullSurahVerses.length > 0 && selectedChapterInfo) {
      return (
        <FullSurahView
          verses={fullSurahVerses}
          chapterName={selectedChapterInfo.name_simple}
          chapterNameArabic={selectedChapterInfo.name_arabic}
          showTranslation={viewingOptions.showTranslation}
          showTransliteration={viewingOptions.showTransliteration}
        />
      );
    }

    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            No verses found for the selected chapter.
          </p>
        </CardContent>
      </Card>
    );
  }

  // --- VERSE-BY-VERSE OR WORD-BY-WORD MODE ---
  if (isError && error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (isLoading) return <LoadingSkeleton count={5} />;

  if (verses && verses.length > 0) {
    if (viewingOptions.mode === "verse") {
      return (
        <>
          <VerseByVerseView
            verses={verses}
            showTranslation={viewingOptions.showTranslation}
            showTransliteration={viewingOptions.showTransliteration}
            selectedVerse={selectedVerse}
            onVerseSelect={setSelectedVerse}
          />
          {pagination && pagination.total_pages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={pagination.total_pages}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
            />
          )}
        </>
      );
    }

    if (viewingOptions.mode === "word") {
      return (
        <>
          <WordByWordView
            verses={verses}
            showTranslation={viewingOptions.showTranslation}
            showTransliteration={viewingOptions.showTransliteration}
            showWordByWord={viewingOptions.showWordByWord}
          />
          {pagination && pagination.total_pages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={pagination.total_pages}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
            />
          )}
        </>
      );
    }
  }

  return (
    <Card>
      <CardContent className="p-8 text-center">
        <p className="text-muted-foreground">
          No verses found for the selected chapter.
        </p>
      </CardContent>
    </Card>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between pt-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentPage === 1}
        className="flex items-center gap-2 bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2 bg-transparent"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
