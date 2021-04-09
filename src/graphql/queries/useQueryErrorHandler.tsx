import { ApolloError } from "@apollo/client"
import React, { useCallback } from "react"
import { captureException } from "@sentry/react"

export function useQueryErrorHandler(): (error: ApolloError) => void {
  const callback = useCallback((error: ApolloError) => {
    captureException(error)
  }, [])

  return callback
}
