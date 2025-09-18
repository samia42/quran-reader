import useSWR from "swr"
import { fetchChapters } from "@/lib/api"
import type { Chapter, ApiError } from "@/types/quran"

interface UseChaptersReturn {
  chapters: Chapter[] | null
  isLoading: boolean
  isError: boolean
  error: ApiError | null
  refetch: () => void
}

export const useChapters = (): UseChaptersReturn => {
  const { data, error, isLoading, mutate } = useSWR("chapters", fetchChapters, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    errorRetryCount: 3,
    dedupingInterval: 3600000, // 1 hour cache for chapters (rarely change)
  })

  const isApiError = (data: any): data is ApiError => {
    return data && !data.success && data.message
  }

  return {
    chapters: data && !isApiError(data) ? data.chapters || null : null,
    isLoading,
    isError: !!error || isApiError(data),
    error: isApiError(data) ? data : error ? handleApiError(error) : null,
    refetch: mutate,
  }
}

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
