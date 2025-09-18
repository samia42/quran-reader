import useSWR from "swr"
import { fetchVersesByChapter } from "@/lib/api"
import type { ApiResponse, Verse, ApiError } from "@/types/quran"

interface UseVersesReturn {
  verses: Verse[] | null
  isLoading: boolean
  isError: boolean
  error: ApiError | null
  pagination: ApiResponse<Verse>["pagination"] | null
  refetch: () => void
}

export const useVerses = (chapterNumber: number, page = 1, perPage = 10, enabled = true): UseVersesReturn => {
  const { data, error, isLoading, mutate } = useSWR(
    enabled && chapterNumber ? `verses-${chapterNumber}-${page}-${perPage}` : null,
    () => fetchVersesByChapter(chapterNumber, page, perPage),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      dedupingInterval: 300000, // 5 minutes cache
    },
  )

  const isApiError = (data: any): data is ApiError => {
    return data && !data.success && data.message
  }

  return {
    verses: data && !isApiError(data) ? data.verses || null : null,
    isLoading,
    isError: !!error || isApiError(data),
    error: isApiError(data) ? data : error ? handleApiError(error) : null,
    pagination: data && !isApiError(data) ? data.pagination || null : null,
    refetch: mutate,
  }
}

// Helper function for consistent error handling
const handleApiError = (error: unknown): ApiError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      type: "client_error",
      success: false,
    }
  }
  return {
    message: "An unexpected error occurred",
    type: "unknown_error",
    success: false,
  }
}
