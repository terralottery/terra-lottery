declare module "@terra-dev/broadcastable-operation/global" {
  import { AddressProvider } from "./packages/@anchor-protocol/anchor.js"
  import { ContractAddress } from "/packages/@anchor-protocol/types"
  import { WalletState } from "/packages/@anchor-protocol/wallet-provider"
  import { ApolloClient } from "@apollo/client"
  import { Constants } from "./contexts/contants"

  interface GlobalDependency extends Constants {
    addressProvider?: AddressProvider
    address?: ContractAddress
    client?: ApolloClient<any>
    post?: WalletState["post"]
  }
}
