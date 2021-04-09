import type {
  cw20,
  CW20Addr,
  HumanAddr,
  moneyMarket,
  Num,
  Rate,
  uaUST,
  WASMContractResult,
} from "@anchor-protocol/types"
import { gql, useQuery } from "@apollo/client"
import { useEventBusListener } from "@terra-dev/event-bus"
import { createMap, Mapped, useMap } from "@terra-dev/use-map"
import { useLastSyncedHeight } from "./lastSyncedHeight"
import { parseResult } from "./parseResult"
import { MappedQueryResult } from "./types"
import { useQueryErrorHandler } from "./useQueryErrorHandler"
import { useRefetch } from "./useRefetch"
import { useMemo } from "react"
import { useUserWallet } from "../../packages/@anchor-protocol/wallet-provider"
import { useContractAddress } from "../../contexts/contract"

export interface RawData {
  aUSTBalance: WASMContractResult
  exchangeRate: WASMContractResult
}

export interface Data {
  aUSTBalance: WASMContractResult<cw20.BalanceResponse<uaUST>>
  exchangeRate: WASMContractResult<moneyMarket.market.EpochStateResponse>
}

export const dataMap = createMap<RawData, Data>({
  // @ts-ignore
  aUSTBalance: (existing: Mapped<RawData, Data>, { aUSTBalance }) => {
    return aUSTBalance
      ? parseResult(existing.aUSTBalance, aUSTBalance.Result)
      : existing.aUSTBalance
  },
  // @ts-ignore
  exchangeRate: (existing: Mapped<RawData, Data>, { exchangeRate }) => {
    return exchangeRate
      ? parseResult(existing.exchangeRate, exchangeRate.Result)
      : existing.exchangeRate
  },
})

export const mockupData: Mapped<RawData, Data> = {
  __data: {
    aUSTBalance: {
      Result: "",
    },
    exchangeRate: {
      Result: "",
    },
  },
  aUSTBalance: {
    Result: "",
    balance: "0" as uaUST,
  },
  exchangeRate: {
    Result: "",
    exchange_rate: "1" as Rate,
    aterra_supply: "0" as Num,
  },
}

export interface RawVariables {
  anchorTokenContract: string
  anchorTokenBalanceQuery: string
  moneyMarketContract: string
  moneyMarketEpochQuery: string
}

export interface Variables {
  anchorTokenContract: CW20Addr
  anchorTokenBalanceQuery: cw20.Balance
  moneyMarketContract: HumanAddr
  moneyMarketEpochQuery: moneyMarket.market.EpochState
}

export function mapVariables({
  anchorTokenContract,
  anchorTokenBalanceQuery,
  moneyMarketContract,
  moneyMarketEpochQuery,
}: Variables): RawVariables {
  return {
    anchorTokenContract,
    anchorTokenBalanceQuery: JSON.stringify(anchorTokenBalanceQuery),
    moneyMarketContract,
    moneyMarketEpochQuery: JSON.stringify(moneyMarketEpochQuery),
  }
}

export const query = gql`
  query __totalDeposit(
    $anchorTokenContract: String!
    $anchorTokenBalanceQuery: String!
    $moneyMarketContract: String!
    $moneyMarketEpochQuery: String!
  ) {
    aUSTBalance: WasmContractsContractAddressStore(
      ContractAddress: $anchorTokenContract
      QueryMsg: $anchorTokenBalanceQuery
    ) {
      Result
    }

    exchangeRate: WasmContractsContractAddressStore(
      ContractAddress: $moneyMarketContract
      QueryMsg: $moneyMarketEpochQuery
    ) {
      Result
    }
  }
`

export function useDeposit(): MappedQueryResult<RawVariables, RawData, Data> {
  const { moneyMarket, cw20 } = useContractAddress()
  const userWallet = useUserWallet()

  const { data: lastSyncedHeight } = useLastSyncedHeight()

  const variables = useMemo(() => {
    if (
      !userWallet ||
      typeof lastSyncedHeight !== "number" ||
      lastSyncedHeight === 0
    )
      return undefined

    return mapVariables({
      anchorTokenContract: cw20.aUST,
      anchorTokenBalanceQuery: {
        balance: {
          address: userWallet.walletAddress,
        },
      },
      moneyMarketContract: moneyMarket.market,
      moneyMarketEpochQuery: {
        epoch_state: {
          block_height: lastSyncedHeight,
        },
      },
    })
  }, [cw20.aUST, lastSyncedHeight, moneyMarket.market, userWallet])

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

  useEventBusListener("interest-earned-updated", () => {
    if (userWallet) {
      _refetch()
    }
  })

  const data = useMap(_data, dataMap)
  const refetch = useRefetch(_refetch, dataMap)

  return {
    ...result,
    data: userWallet ? data : mockupData,
    // @ts-ignore
    refetch,
  }
}
