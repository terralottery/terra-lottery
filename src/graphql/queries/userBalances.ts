import type {
  uANC,
  uAncUstLP,
  uaUST,
  ubLuna,
  ubLunaLunaLP,
  uLuna,
  uUST,
} from "@anchor-protocol/types"
import { gql, useQuery } from "@apollo/client"
import { useSubscription } from "@terra-dev/broadcastable-operation"
import { createMap, Mapped, useMap } from "@terra-dev/use-map"
import { useMemo } from "react"
import { useContractAddress } from "../../contexts/contract"
import { MappedQueryResult } from "./types"
import { useRefetch } from "./useRefetch"
import { useUserWallet } from "../../packages/@anchor-protocol/wallet-provider"
import { NominalType } from "@anchor-protocol/types/common"

export declare type uMIR<T = string> = T & NominalType<"umir">
export declare type MIR<T = string> = T & NominalType<"mir">

export interface RawData {
  bankBalances: {
    Result: { Denom: string; Amount: string }[]
  }

  ubLunaBalance: {
    Result: string
  }

  uaUSTBalance: {
    Result: string
  }

  uANCBalance: {
    Result: string
  }

  uMIRBalance: {
    Result: string
  }

  uAncUstLPBalance: {
    Result: string
  }

  ubLunaLunaLPBalance: {
    Result: string
  }
}

export interface Data {
  uUSD: uUST<string>
  uLuna: uLuna<string>
  ubLuna: ubLuna<string>
  uaUST: uaUST<string>
  uANC: uANC<string>
  uMIR: uMIR<string>
  uAncUstLP: uAncUstLP<string>
  ubLunaLunaLP: ubLunaLunaLP<string>
}

export const dataMap = createMap<RawData, Data>({
  uUSD: (_, { bankBalances }) => {
    return (bankBalances.Result.find(({ Denom }) => Denom === "uusd")?.Amount ??
      "0") as uUST
  },
  uLuna: (_, { bankBalances }) => {
    return (bankBalances.Result.find(({ Denom }) => Denom === "uluna")
      ?.Amount ?? "0") as uLuna
  },
  uaUST: (_, { uaUSTBalance }) => {
    return JSON.parse(uaUSTBalance.Result).balance as uaUST
  },
  ubLuna: (_, { ubLunaBalance }) => {
    return JSON.parse(ubLunaBalance.Result).balance as ubLuna
  },
  uANC: (_, { uANCBalance }) => {
    return JSON.parse(uANCBalance.Result).balance as uANC
  },
  uMIR: (_, { uMIRBalance }) => {
    return JSON.parse(uMIRBalance.Result).balance as uMIR
  },
  uAncUstLP: (_, { uAncUstLPBalance }) => {
    return JSON.parse(uAncUstLPBalance.Result).balance as uAncUstLP
  },
  ubLunaLunaLP: (_, { ubLunaLunaLPBalance }) => {
    return JSON.parse(ubLunaLunaLPBalance.Result).balance as ubLunaLunaLP
  },
})

export const mockupData: Mapped<RawData, Data> = {
  __data: {
    bankBalances: {
      Result: [
        { Denom: "uusd", Amount: "0" },
        { Denom: "uluna", Amount: "0" },
      ],
    },
    uaUSTBalance: {
      Result: "",
    },
    ubLunaBalance: {
      Result: "",
    },
    uANCBalance: {
      Result: "",
    },
    uMIRBalance: {
      Result: "",
    },
    uAncUstLPBalance: {
      Result: "",
    },
    ubLunaLunaLPBalance: {
      Result: "",
    },
  },
  uUSD: "0" as uUST,
  uaUST: "0" as uaUST,
  uLuna: "0" as uLuna,
  ubLuna: "0" as ubLuna,
  uANC: "0" as uANC,
  uMIR: "0" as uMIR,
  uAncUstLP: "0" as uAncUstLP,
  ubLunaLunaLP: "0" as ubLunaLunaLP,
}

export interface RawVariables {
  walletAddress: string
  bAssetTokenAddress: string
  bAssetTokenBalanceQuery: string
  aTokenAddress: string
  aTokenBalanceQuery: string
  ANCTokenAddress: string
  ANCTokenBalanceQuery: string
  MIRTokenAddress: string
  MIRTokenBalanceQuery: string
  AncUstLPTokenAddress: string
  AncUstLPTokenBalanceQuery: string
  bLunaLunaLPTokenAddress: string
  bLunaLunaLPTokenBalanceQuery: string
}

export interface Variables {
  walletAddress: string
  bAssetTokenAddress: string
  aTokenAddress: string
  ANCTokenAddress: string
  MIRTokenAddress: string
  AncUstLPTokenAddress: string
  bLunaLunaLPTokenAddress: string
}

export function mapVariables({
  walletAddress,
  bAssetTokenAddress,
  aTokenAddress,
  ANCTokenAddress,
  MIRTokenAddress,
  AncUstLPTokenAddress,
  bLunaLunaLPTokenAddress,
}: Variables): RawVariables {
  return {
    walletAddress,
    bAssetTokenAddress,
    bAssetTokenBalanceQuery: JSON.stringify({
      balance: {
        address: walletAddress,
      },
    }),
    aTokenAddress,
    aTokenBalanceQuery: JSON.stringify({
      balance: {
        address: walletAddress,
      },
    }),
    ANCTokenAddress,
    ANCTokenBalanceQuery: JSON.stringify({
      balance: {
        address: walletAddress,
      },
    }),
    MIRTokenAddress,
    MIRTokenBalanceQuery: JSON.stringify({
      balance: {
        address: walletAddress,
      },
    }),
    AncUstLPTokenAddress,
    AncUstLPTokenBalanceQuery: JSON.stringify({
      balance: {
        address: walletAddress,
      },
    }),
    bLunaLunaLPTokenAddress,
    bLunaLunaLPTokenBalanceQuery: JSON.stringify({
      balance: {
        address: walletAddress,
      },
    }),
  }
}

export const query = gql`
  query __userBalances(
    $walletAddress: String!
    $bAssetTokenAddress: String!
    $bAssetTokenBalanceQuery: String!
    $aTokenAddress: String!
    $aTokenBalanceQuery: String!
    $ANCTokenAddress: String!
    $ANCTokenBalanceQuery: String!
    $MIRTokenAddress: String!
    $MIRTokenBalanceQuery: String!
    $AncUstLPTokenAddress: String!
    $AncUstLPTokenBalanceQuery: String!
    $bLunaLunaLPTokenAddress: String!
    $bLunaLunaLPTokenBalanceQuery: String!
  ) {
    # uluna, ukrt, uust...
    bankBalances: BankBalancesAddress(Address: $walletAddress) {
      Result {
        Denom
        Amount
      }
    }

    # ubluna
    ubLunaBalance: WasmContractsContractAddressStore(
      ContractAddress: $bAssetTokenAddress
      QueryMsg: $bAssetTokenBalanceQuery
    ) {
      Result
    }

    # uaust
    uaUSTBalance: WasmContractsContractAddressStore(
      ContractAddress: $aTokenAddress
      QueryMsg: $aTokenBalanceQuery
    ) {
      Result
    }

    # uanc
    uANCBalance: WasmContractsContractAddressStore(
      ContractAddress: $ANCTokenAddress
      QueryMsg: $ANCTokenBalanceQuery
    ) {
      Result
    }

    # umir
    uMIRBalance: WasmContractsContractAddressStore(
      ContractAddress: $MIRTokenAddress
      QueryMsg: $MIRTokenBalanceQuery
    ) {
      Result
    }

    # u anc ust lp
    uAncUstLPBalance: WasmContractsContractAddressStore(
      ContractAddress: $AncUstLPTokenAddress
      QueryMsg: $AncUstLPTokenBalanceQuery
    ) {
      Result
    }

    # u bluna luna lp
    ubLunaLunaLPBalance: WasmContractsContractAddressStore(
      ContractAddress: $bLunaLunaLPTokenAddress
      QueryMsg: $bLunaLunaLPTokenBalanceQuery
    ) {
      Result
    }
  }
`

export function useUserBalances(): MappedQueryResult<
  RawVariables,
  RawData,
  Data
> {
  const { cw20 } = useContractAddress()

  const userWallet = useUserWallet()

  const variables = useMemo(() => {
    if (!userWallet) return undefined

    return mapVariables({
      walletAddress: userWallet.walletAddress,
      bAssetTokenAddress: cw20.bLuna,
      aTokenAddress: cw20.aUST,
      ANCTokenAddress: cw20.ANC,
      MIRTokenAddress: cw20.MIR,
      AncUstLPTokenAddress: cw20.AncUstLP,
      bLunaLunaLPTokenAddress: cw20.bLunaLunaLP,
    })
  }, [
    cw20.ANC,
    cw20.MIR,
    cw20.AncUstLP,
    cw20.aUST,
    cw20.bLuna,
    cw20.bLunaLunaLP,
    userWallet,
  ])

  const {
    previousData,
    data: _data = previousData,
    refetch: _refetch,
    ...result
  } = useQuery<RawData, RawVariables>(query, {
    skip: !userWallet,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    variables,
  })

  useSubscription((id, event) => {
    if (event === "done") {
      _refetch()
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
