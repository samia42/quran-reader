"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { useChapters } from "@/hooks/use-chapters";
import { useVerses } from "@/hooks/use-verses";
import type { ViewingOptions } from "@/types/quran";
import QuranHeader from "@/components/QuranHeader";
import ChapterSelectionCard from "@/components/ChapterSelectionCard";
import QuranContentLayout from "@/components/QuranContentLayout";
import { VERSES_PER_PAGE } from "@/constants";

export default function QuranReaderPage() {
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [viewingOptions, setViewingOptions] = useState<ViewingOptions>({
    mode: "word",
    showTranslation: true,
    showTransliteration: false,
    showWordByWord: true,
  });

  const {
    chapters,
    isLoading: chaptersLoading,
    isError: chaptersError,
    error: chaptersErrorData,
    refetch: refetchChapters,
  } = useChapters();

  const selectedChapterInfo = chapters?.find((ch) => ch.id === selectedChapter);

  const versesQuery = useVerses(
    selectedChapter,
    currentPage,
    VERSES_PER_PAGE,
    viewingOptions.mode !== "full"
  );

  const fullSurahQuery = useVerses(
    selectedChapter,
    1,
    selectedChapterInfo?.verses_count || 50,
    viewingOptions.mode === "full"
  );

  const handleChapterChange = (chapterId: number) => {
    setSelectedChapter(chapterId);
    setCurrentPage(1);
    setSelectedVerse(null);
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <QuranHeader
          icon={<BookOpen className="h-8 w-8 text-primary" />}
          title="Interactive Quran Reader"
          subtitle="Experience the Quran with word-by-word analysis, interactive translations, and beautiful Arabic typography"
        />

        <ChapterSelectionCard
          chapters={chapters || []}
          selectedChapter={selectedChapter}
          selectedChapterInfo={selectedChapterInfo}
          onChapterChange={handleChapterChange}
          loading={chaptersLoading}
          error={chaptersError}
          errorData={chaptersErrorData}
          refetch={refetchChapters}
        />

        <QuranContentLayout
          selectedVerse={selectedVerse}
          setSelectedVerse={setSelectedVerse}
          selectedChapterInfo={selectedChapterInfo}
          versesQuery={versesQuery}
          fullSurahQuery={fullSurahQuery}
          viewingOptions={viewingOptions}
          setViewingOptions={setViewingOptions}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </main>
  );
}
