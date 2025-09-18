"use client"

import { type FC, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2 } from "lucide-react"
import type { Verse } from "@/types/quran"
import { cn } from "@/lib/utils"

export interface VerseCardProps {
  verse: Verse
  className?: string
  showTranslation?: boolean
}

const VerseCard: FC<VerseCardProps> = ({ verse, className, showTranslation = true }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const handleAudioToggle = () => {
    if (!verse.audio?.url) return

    if (audio) {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        audio.play()
        setIsPlaying(true)
      }
    } else {
      const newAudio = new Audio(verse.audio.url)
      newAudio.addEventListener("ended", () => setIsPlaying(false))
      newAudio.addEventListener("error", () => setIsPlaying(false))
      setAudio(newAudio)
      newAudio.play()
      setIsPlaying(true)
    }
  }

  const translation = verse.translations?.[0]

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6 space-y-4">
        {/* Verse number and chapter info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Surah {verse.chapter_id}, Verse {verse.verse_number}
          </span>
          <span>Juz {verse.juz_number}</span>
        </div>

        {/* Arabic text */}
        <div className="arabic-text text-right leading-relaxed">{verse.text_uthmani}</div>

        {/* Translation */}
        {showTranslation && translation && (
          <div className="text-foreground leading-relaxed">
            <p className="text-balance">{translation.text}</p>
            {translation.resource_name && (
              <p className="text-xs text-muted-foreground mt-2">— {translation.resource_name}</p>
            )}
          </div>
        )}

        {/* Audio controls */}
        {verse.audio?.url && (
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAudioToggle}
              className="flex items-center gap-2 bg-transparent"
              aria-label={isPlaying ? "Pause recitation" : "Play recitation"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <Volume2 className="h-4 w-4" />
              <span className="sr-only">{isPlaying ? "Pause" : "Play"} verse recitation</span>
            </Button>
            <span className="text-xs text-muted-foreground">Listen to recitation</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default VerseCard
