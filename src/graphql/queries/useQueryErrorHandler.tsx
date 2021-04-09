import { ApolloError } from "@apollo/client"
import { useCallback } from "react"
import { captureException } from "@sentry/react"

export function useQueryErrorHandler(): (error: ApolloError) => void {
  const callback = useCallback((error: ApolloError) => {
    captureException(error)
  }, [])

  return callback
}
