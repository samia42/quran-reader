"use client"

import type { FC } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"
import type { ApiError } from "@/types/quran"
import { cn } from "@/lib/utils"

export interface ErrorMessageProps {
  error: ApiError
  onRetry?: () => void
  className?: string
}

const ErrorMessage: FC<ErrorMessageProps> = ({ error, onRetry, className }) => {
  return (
    <Alert variant="destructive" className={cn("w-full", className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error Loading Content</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">{error.message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="flex items-center gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

export default ErrorMessage
