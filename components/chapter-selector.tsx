"use client"

import type { FC } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Chapter } from "@/types/quran"
import { cn } from "@/lib/utils"

export interface ChapterSelectorProps {
  chapters: Chapter[]
  selectedChapter: number | null
  onChapterChange: (chapterId: number) => void
  className?: string
  isLoading?: boolean
}

const ChapterSelector: FC<ChapterSelectorProps> = ({
  chapters,
  selectedChapter,
  onChapterChange,
  className,
  isLoading = false,
}) => {
  return (
    <Select
      value={selectedChapter?.toString() || ""}
      onValueChange={(value) => onChapterChange(Number.parseInt(value, 10))}
      disabled={isLoading}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder="Select a Surah" />
      </SelectTrigger>
      <SelectContent>
        {chapters.map((chapter) => (
          <SelectItem key={chapter.id} value={chapter.id.toString()}>
            <div className="flex items-center justify-between w-full">
              <span>
                {chapter.id}. {chapter.name_simple}
              </span>
              <span className="text-sm text-muted-foreground ml-2 arabic-text text-base">{chapter.name_arabic}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default ChapterSelector
