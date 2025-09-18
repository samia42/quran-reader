"use client"

import type { FC } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Hash, Layers, Star } from "lucide-react"
import type { Verse } from "@/types/quran"

export interface VerseMetadataPanelProps {
  verse: Verse
  className?: string
}

const VerseMetadataPanel: FC<VerseMetadataPanelProps> = ({ verse, className }) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Verse Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary metadata */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Verse Key</span>
            </div>
            <Badge variant="secondary">{verse.verse_key}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Juz</span>
            </div>
            <Badge variant="outline">{verse.juz_number}</Badge>
          </div>
        </div>

        <Separator />

        {/* Secondary metadata */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Page:</span>
            <span className="font-medium">{verse.page_number}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Hizb:</span>
            <span className="font-medium">{verse.hizb_number}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Rub el Hizb:</span>
            <span className="font-medium">{verse.rub_el_hizb_number}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Ruku:</span>
            <span className="font-medium">{verse.ruku_number}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Manzil:</span>
            <span className="font-medium">{verse.manzil_number}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Words:</span>
            <span className="font-medium">{verse.words?.length || 0}</span>
          </div>
        </div>

        {verse.sajdah_number && (
          <>
            <Separator />
            <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Contains Sajdah #{verse.sajdah_number}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default VerseMetadataPanel
