import type { DateTime, uUST } from "@anchor-protocol/types"
import { Denom, HumanAddr } from "@anchor-protocol/types"
import { gql, useQuery } from "@apollo/client"
import { useSubscription } from "@terra-dev/broadcastable-operation"
import { createMap, Mapped, useMap } from "@terra-dev/use-map"
import { MappedQueryResult } from "./types"
import { useQueryErrorHandler } from "./useQueryErrorHandler"
import { useRefetch } from "./useRefetch"
import { useMemo } from "react"
import { useUserWallet } from "../../packages/@anchor-protocol/wallet-provider"

export interface RawData {
  transactionHistory: {
    Address: HumanAddr
    Contract: string
    Height: number
    InAmount: uUST<string>
    InDenom: Denom
    OutAmount: uUST<string>
    OutDenom: Denom
    Timestamp: DateTime
    TransactionType: string
    TxHash: string
  }[]
}

export type Data = RawData

export const dataMap = createMap<RawData, Data>({
  transactionHistory: (_, { transactionHistory }) => {
    return transactionHistory
  },
})

export const mockupData: Mapped<RawData, Data> = {
  __data: {
    transactionHistory: [],
  },
  transactionHistory: [],
}

export interface RawVariables {
  walletAddress: HumanAddr
}

export type Variables = RawVariables

export function mapVariables(variables: Variables): RawVariables {
  return variables
}

export const query = gql`
  query __transactionHistory($walletAddress: String!) {
    transactionHistory: TransactionHistory(
      Address: $walletAddress
      Order: DESC
    ) {
      Address
      Contract
      InAmount
      InDenom
      OutAmount
      OutDenom
      Timestamp
      TransactionType
      TxHash
      Height
    }
  }
`

export function useTransactionHistory(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const userWallet = useUserWallet()

  const variables = useMemo(() => {
    if (!userWallet) return undefined

    return mapVariables({
      walletAddress: userWallet.walletAddress,
    })
  }, [userWallet])

  const onError = useQueryErrorHandler()

  const {
    previousData,
    data: _data = previousData,
    refetch: _refetch,
    error,
    ...result
  } = useQuery<RawData, RawVariables>(query, {
    skip: !variables || !userWallet,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    variables,
    onError,
  })

  useSubscription((id, event) => {
    if (event === "done") {
      setTimeout(_refetch, 2000)
    }
  })

  const data = useMap(_data, dataMap)
  const refetch = useRefetch(_refetch, dataMap)

  return {
    ...result,
    data: userWallet ? data : mockupData,
    refetch,
  }
}
