import ViewingModeSelector from "@/components/viewing-mode-selector";
import VerseMetadataPanel from "@/components/verse-metadata-panel";
import VerseRenderer from "@/components/VerseRenderer";

export default function QuranContentLayout({
  selectedVerse,
  setSelectedVerse,
  selectedChapterInfo,
  versesQuery,
  fullSurahQuery,
  viewingOptions,
  setViewingOptions,
  currentPage,
  setCurrentPage,
}: any) {
  const selectedVerseData = versesQuery.verses?.find(
    (v: any) => v.id === selectedVerse
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-1">
        <div className="sticky top-4 space-y-4">
          <ViewingModeSelector
            options={viewingOptions}
            onOptionsChange={setViewingOptions}
          />
          {selectedVerseData && viewingOptions.mode !== "full" && (
            <VerseMetadataPanel verse={selectedVerseData} />
          )}
        </div>
      </div>

      <div className="lg:col-span-4">
        <VerseRenderer
          viewingOptions={viewingOptions}
          selectedChapterInfo={selectedChapterInfo}
          versesQuery={versesQuery}
          fullSurahQuery={fullSurahQuery}
          selectedVerse={selectedVerse}
          setSelectedVerse={setSelectedVerse}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
