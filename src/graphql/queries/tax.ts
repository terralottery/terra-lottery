import type { Rate, uUST } from "@anchor-protocol/types"
import { gql, useQuery } from "@apollo/client"
import { createMap, Mapped, useMap } from "@terra-dev/use-map"
import { useMemo } from "react"
import { MappedQueryResult } from "./types"
import { useRefetch } from "./useRefetch"

export interface RawData {
  tax_rate: {
    Height: string
    Result: string
  }
  tax_cap_denom: {
    Height: string
    Result: string
  }
}

export interface Data {
  taxRate: Rate
  maxTaxUUSD: uUST
}

export const dataMap = createMap<RawData, Data>({
  taxRate: (_, { tax_rate }) => {
    return tax_rate.Result as Rate
  },
  maxTaxUUSD: (_, { tax_cap_denom }) => {
    return tax_cap_denom.Result as uUST
  },
})

export const mockupData: Mapped<RawData, Data> = {
  __data: {
    tax_rate: {
      Height: "0",
      Result: "1",
    },
    tax_cap_denom: {
      Height: "0",
      Result: "3500000",
    },
  },
  taxRate: "1" as Rate,
  maxTaxUUSD: "3500000" as uUST,
}

export type RawVariables = {}

export type Variables = RawVariables

export function mapVariables(variables: Variables): RawVariables {
  return variables
}

export const query = gql`
  query __tax {
    tax_rate: TreasuryTaxRate {
      Height
      Result
    }
    tax_cap_denom: TreasuryTaxCapDenom(Denom: "uusd") {
      Height
      Result
    }
  }
`

export function useTax(): MappedQueryResult<RawVariables, RawData, Data> {
  const variables = useMemo(() => {
    return mapVariables({})
  }, [])

  const {
    previousData,
    data: _data = previousData,
    refetch: _refetch,
    ...result
  } = useQuery<RawData, RawVariables>(query, {
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    variables,
  })

  const data = useMap(_data, dataMap)
  const refetch = useRefetch(_refetch, dataMap)

  return {
    ...result,
    data: data ?? mockupData,
    refetch,
  }
}
