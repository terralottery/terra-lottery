import { microfy } from "@anchor-protocol/notation"
import type {
  Rate,
  uANC,
  uAncUstLP,
  uaUST,
  ubLuna,
  ubLunaLunaLP,
  uLuna,
  UST,
  uUST,
} from "@anchor-protocol/types"
import { useUserWallet } from "../packages/@anchor-protocol/wallet-provider"
import { BigSource } from "big.js"
import type { ReactNode } from "react"
import {
  Consumer,
  Context,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react"
import { Data as TaxData, useTax } from "../graphql/queries/tax"
import {
  Data as UserBalancesData,
  useUserBalances,
} from "../graphql/queries/userBalances"

export interface BankProviderProps {
  children: ReactNode
}

export interface Bank {
  tax: TaxData
  refetchTax: () => void
  userBalances: UserBalancesData
  refetchUserBalances: () => void
}

// @ts-ignore
const BankContext: Context<Bank> = createContext<Bank>()

export function BankProvider({ children }: BankProviderProps) {
  const userWallet = useUserWallet()

  const { data: taxData, refetch: refetchTax } = useTax()

  const { data: balancesData, refetch: refetchUserBalances } = useUserBalances()

  const state = useMemo<Bank>(() => {
    const tax = {
      taxRate: taxData.taxRate ?? ("0.1" as Rate),
      maxTaxUUSD:
        taxData.maxTaxUUSD ??
        (microfy(0.1 as UST<BigSource>).toString() as uUST),
    }

    return !!userWallet
      ? {
          tax,
          refetchTax,
          userBalances: {
            uUSD: balancesData.uUSD ?? ("0" as uUST),
            uLuna: balancesData.uLuna ?? ("0" as uLuna),
            uaUST: balancesData.uaUST ?? ("0" as uaUST),
            ubLuna: balancesData.ubLuna ?? ("0" as ubLuna),
            uANC: balancesData.uANC ?? ("0" as uANC),
            uAncUstLP: balancesData.uAncUstLP ?? ("0" as uAncUstLP),
            ubLunaLunaLP: balancesData.ubLunaLunaLP ?? ("0" as ubLunaLunaLP),
          },
          refetchUserBalances,
        }
      : {
          tax,
          refetchTax: () => {},
          userBalances: {
            uUSD: "0" as uUST,
            uLuna: "0" as uLuna,
            ubLuna: "0" as ubLuna,
            uaUST: "0" as uaUST,
            uANC: "0" as uANC,
            uAncUstLP: "0" as uAncUstLP,
            ubLunaLunaLP: "0" as ubLunaLunaLP,
          },
          refetchUserBalances,
        }
  }, [
    balancesData.uANC,
    balancesData.uAncUstLP,
    balancesData.uLuna,
    balancesData.uUSD,
    balancesData.uaUST,
    balancesData.ubLuna,
    balancesData.ubLunaLunaLP,
    refetchTax,
    refetchUserBalances,
    userWallet,
    taxData.maxTaxUUSD,
    taxData.taxRate,
  ])

  useEffect(() => {
    if (userWallet) {
      refetchTax()
      refetchUserBalances()
    }
  }, [refetchTax, refetchUserBalances, userWallet])

  return <BankContext.Provider value={state}>{children}</BankContext.Provider>
}

export function useBank(): Bank {
  return useContext(BankContext)
}

export const BankConsumer: Consumer<Bank> = BankContext.Consumer
