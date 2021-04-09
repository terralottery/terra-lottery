import {
  cw20,
  CW20Addr,
  HumanAddr,
  moneyMarket,
  uaUST,
  WASMContractResult,
} from "@anchor-protocol/types"
import { gql, useQuery } from "@apollo/client"
import { useEventBus } from "@terra-dev/event-bus"
import { createMap, useMap } from "@terra-dev/use-map"
import { useContractAddress } from "../../contexts/contract"
import { useLastSyncedHeight } from "./lastSyncedHeight"
import { parseResult } from "./parseResult"
import { MappedQueryResult } from "./types"
import { useQueryErrorHandler } from "./useQueryErrorHandler"
import { useRefetch } from "./useRefetch"
import { useEffect, useMemo } from "react"
import { useUserWallet } from "../../packages/@anchor-protocol/wallet-provider"

export interface RawData {
  aUSTBalance: WASMContractResult
  moneyMarketEpochState: WASMContractResult
  overseerEpochState: WASMContractResult
}

export interface Data {
  aUSTBalance: WASMContractResult<cw20.BalanceResponse<uaUST>>
  moneyMarketEpochState: WASMContractResult<moneyMarket.market.EpochStateResponse>
  overseerEpochState: WASMContractResult<moneyMarket.overseer.EpochStateResponse>
}

export const dataMap = createMap<RawData, Data>({
  aUSTBalance: (existing, { aUSTBalance }) => {
    return parseResult(existing.aUSTBalance, aUSTBalance.Result)
  },
  moneyMarketEpochState: (existing, { moneyMarketEpochState }) => {
    return parseResult(
      existing.moneyMarketEpochState,
      moneyMarketEpochState.Result
    )
  },
  overseerEpochState: (existing, { overseerEpochState }) => {
    return parseResult(existing.overseerEpochState, overseerEpochState.Result)
  },
})

export interface RawVariables {
  anchorTokenContract: string
  anchorTokenQuery: string
  moneyMarketContract: string
  moneyMarketEpochStateQuery: string
  overseerContract: string
  overseerEpochStateQuery: string
}

export interface Variables {
  anchorTokenContract: CW20Addr
  anchorTokenQuery: cw20.Balance
  moneyMarketContract: HumanAddr
  moneyMarketEpochStateQuery: moneyMarket.market.EpochState
  overseerContract: HumanAddr
  overseerEpochStateQuery: moneyMarket.overseer.EpochState
}

export function mapVariables({
  anchorTokenContract,
  anchorTokenQuery,
  moneyMarketContract,
  moneyMarketEpochStateQuery,
  overseerContract,
  overseerEpochStateQuery,
}: Variables): RawVariables {
  return {
    anchorTokenContract,
    anchorTokenQuery: JSON.stringify(anchorTokenQuery),
    moneyMarketContract,
    moneyMarketEpochStateQuery: JSON.stringify(moneyMarketEpochStateQuery),
    overseerContract,
    overseerEpochStateQuery: JSON.stringify(overseerEpochStateQuery),
  }
}

export const query = gql`
  query __expectedInterest(
    $anchorTokenContract: String!
    $anchorTokenQuery: String!
    $moneyMarketContract: String!
    $moneyMarketEpochStateQuery: String!
    $overseerContract: String!
    $overseerEpochStateQuery: String!
  ) {
    aUSTBalance: WasmContractsContractAddressStore(
      ContractAddress: $anchorTokenContract
      QueryMsg: $anchorTokenQuery
    ) {
      Result
    }

    moneyMarketEpochState: WasmContractsContractAddressStore(
      ContractAddress: $moneyMarketContract
      QueryMsg: $moneyMarketEpochStateQuery
    ) {
      Result
    }

    overseerEpochState: WasmContractsContractAddressStore(
      ContractAddress: $overseerContract
      QueryMsg: $overseerEpochStateQuery
    ) {
      Result
    }
  }
`

export function useExpectedInterest(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const userWallet = useUserWallet()

  const { data: lastSyncedHeight } = useLastSyncedHeight()

  const address = useContractAddress()

  const { dispatch } = useEventBus()

  const variables = useMemo(() => {
    if (!userWallet || lastSyncedHeight === 0) {
      return undefined
    }

    return mapVariables({
      anchorTokenContract: address.cw20.aUST,
      anchorTokenQuery: {
        balance: {
          address: userWallet.walletAddress,
        },
      },
      moneyMarketContract: address.moneyMarket.market,
      moneyMarketEpochStateQuery: {
        epoch_state: {
          block_height: lastSyncedHeight,
        },
      },
      overseerContract: address.moneyMarket.overseer,
      overseerEpochStateQuery: {
        epoch_state: {
          block_height: lastSyncedHeight,
        },
      },
    })
  }, [
    address.cw20.aUST,
    address.moneyMarket.market,
    address.moneyMarket.overseer,
    lastSyncedHeight,
    userWallet,
  ])

  const onError = useQueryErrorHandler()

  const {
    previousData,
    data: _data = previousData,
    refetch: _refetch,
    error,
    ...result
  } = useQuery<RawData, RawVariables>(query, {
    skip: !variables,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    //pollInterval: 1000 * 60,
    variables,
    onError,
  })

  const data = useMap(_data, dataMap)
  const refetch = useRefetch(_refetch, dataMap)

  useEffect(() => {
    dispatch("interest-earned-updated")
  }, [variables, dispatch])

  return {
    ...result,
    data,
    refetch,
  }
}
