"use client";

import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Layers, BookOpen } from "lucide-react";
import type { ViewingMode, ViewingOptions } from "@/types/quran";
import { cn } from "@/lib/utils";

export interface ViewingModeSelectorProps {
  options: ViewingOptions;
  onOptionsChange: (options: ViewingOptions) => void;
  className?: string;
}

const ViewingModeSelector: FC<ViewingModeSelectorProps> = ({
  options,
  onOptionsChange,
  className,
}) => {
  const handleModeChange = (mode: ViewingMode) => {
    onOptionsChange({ ...options, mode });
  };

  const toggleOption = (key: keyof Omit<ViewingOptions, "mode">) => {
    onOptionsChange({ ...options, [key]: !options[key] });
  };

  const modes = [
    {
      id: "verse" as ViewingMode,
      label: "By Verse",
      icon: BookOpen,
    },
    {
      id: "word" as ViewingMode,
      label: "By Word",
      icon: Layers,
    },
    {
      id: "full" as ViewingMode,
      label: "Full Ayah",
      icon: Eye,
    },
  ];

  return (
    <Card className={cn("w-full space-y-4", className)}>
      <CardContent className="p-4 space-y-4 ">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="h-4 w-4 text-primary" />
          <h3 className="font-medium text-sm">Viewing Options</h3>
        </div>

        {/* Viewing Mode Selection */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">
            Display Mode
          </p>
          <div className="grid grid-cols-1 gap-2">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isSelected = options.mode === mode.id;

              return (
                <Button
                  key={mode.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleModeChange(mode.id)}
                  className={cn(
                    "justify-start h-auto p-3 text-left",
                    isSelected && "ring-2 ring-primary/20"
                  )}
                >
                  <div className="flex items-start gap-3 w-full">
                    <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{mode.label}</div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Display Options */}
        <div className="space-y-2 pt-2 border-t">
          <p className="text-xs text-muted-foreground font-medium">
            Display Options
          </p>
          <div className="space-y-2">
            <Button
              variant={options.showTranslation ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption("showTranslation")}
              className="w-full justify-start text-xs"
            >
              Show Translation
            </Button>
            <Button
              variant={options.showTransliteration ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption("showTransliteration")}
              className="w-full justify-start text-xs"
            >
              Show Transliteration
            </Button>
            <Button
              variant={options.showWordByWord ? "default" : "outline"}
              size="sm"
              onClick={() => toggleOption("showWordByWord")}
              className="w-full justify-start text-xs"
            >
              Word-by-Word Analysis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewingModeSelector;
