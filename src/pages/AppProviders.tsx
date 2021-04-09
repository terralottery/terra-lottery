import {
  AddressProvider,
  AddressMap,
  AddressProviderFromJson,
} from "@anchor-protocol/anchor.js"
import { ReactNode, useCallback, useMemo } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { ContractAddress, Rate, uUST } from "@anchor-protocol/types"
import { OperationBroadcaster } from "@terra-dev/broadcastable-operation"
import { captureException } from "@sentry/react"
import { ConstantsProvider } from "../contexts/contants"
import { ContractProvider, createContractAddress } from "../contexts/contract"
import {
  ApolloClient,
  ApolloProvider,
  ApolloError,
  HttpLink,
  InMemoryCache,
} from "@apollo/client"
import {
  ChromeExtensionWalletProvider,
  useWallet,
} from "../packages/@anchor-protocol/wallet-provider"
import { GlobalDependency } from "@terra-dev/broadcastable-operation/global"
import { QueryDependencyProvider } from "../packages/@anchor-protocol/queries"
import { BankProvider } from "../contexts/bank"

export const defaultNetwork = {
  chainID: "columbus-4",
  fcd: "https://fcd.terra.dev",
  lcd: "https://lcd.terra.dev",
  name: "mainnet",
  ws: "wss://fcd.terra.dev",
}
export const columbusContractAddresses: AddressMap = {
  bLunaHub: "terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts",
  blunaToken: "terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp",
  blunaReward: "terra17yap3mhph35pcwvhza38c2lkj7gzywzy05h7l0",
  blunaAirdrop: "terra199t7hg7w5vymehhg834r6799pju2q3a0ya7ae9",
  mmInterestModel: "terra1kq8zzq5hufas9t0kjsjc62t2kucfnx8txf547n",
  mmOracle: "terra1cgg6yef7qcdm070qftghfulaxmllgmvk77nc7t",
  mmMarket: "terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s",
  mmOverseer: "terra1tmnqgvg567ypvsvk6rwsga3srp7e3lg6u0elp8",
  mmCustody: "terra1ptjp2vfjrwh0j0faj9r6katm640kgjxnwwq9kn",
  mmLiquidation: "terra1w9ky73v4g7v98zzdqpqgf3kjmusnx4d4mvnac6",
  mmDistributionModel: "terra14mufqpr5mevdfn92p4jchpkxp7xr46uyknqjwq",
  aTerra: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
  terraswapblunaLunaPair: "terra1jxazgm67et0ce260kvrpfv50acuushpjsz2y0p",
  terraswapblunaLunaLPToken: "terra1nuy34nwnsh53ygpc4xprlj263cztw7vc99leh2",
  terraswapAncUstPair: "terra1gm5p3ner9x9xpwugn9sp6gvhd0lwrtkyrecdn3",
  terraswapAncUstLPToken: "terra1gecs98vcuktyfkrve9czrpgtg0m3aq586x6gzm",
  gov: "terra1f32xyep306hhcxxxf7mlyh0ucggc00rm2s9da5",
  distributor: "terra1mxf7d5updqxfgvchd7lv6575ehhm8qfdttuqzz",
  collector: "terra14ku9pgw5ld90dexlyju02u4rn6frheexr5f96h",
  community: "terra12wk8dey0kffwp27l5ucfumczlsc9aned8rqueg",
  staking: "terra1897an2xux840p9lrh6py3ryankc6mspw49xse3",
  ANC: "terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76",
  airdrop: "terra146ahqn6d3qgdvmj8cj96hh03dzmeedhsf0kxqm",
  team: "terra1pm54pmw3ej0vfwn3gtn6cdmaqxt0x37e9jt0za",
  vesting: "terra10evq9zxk2m86n3n3xnpw28jpqwp628c6dzuq42",
  terraswapFactory: "",
}

function Providers({ children }: { children: ReactNode }) {
  const { post } = useWallet()

  const addressMap = useMemo(() => {
    return columbusContractAddresses
  }, [])

  const addressProvider = useMemo<AddressProvider>(() => {
    return new AddressProviderFromJson(addressMap)
  }, [addressMap])

  const address = useMemo<ContractAddress>(() => {
    return createContractAddress(addressProvider, addressMap)
  }, [addressMap, addressProvider])

  const client = useMemo<ApolloClient<any>>(() => {
    const httpLink = new HttpLink({
      uri: ({ operationName }) =>
        `https://mantle.anchorprotocol.com?${operationName}`,
    })

    return new ApolloClient({
      cache: new InMemoryCache(),
      link: httpLink,
    })
  }, [])

  const constants = {
    gasFee: 1000000 as uUST<number>,
    fixedGas: 250000 as uUST<number>,
    blocksPerYear: 4906443,
    gasAdjustment: 1.6 as Rate<number>,
  }
  const operationGlobalDependency = useMemo<GlobalDependency>(
    () => ({
      addressProvider,
      address,
      client,
      post,
      ...constants,
    }),
    [address, addressProvider, client, constants, post]
  )

  const onQueryError = useCallback((error: ApolloError) => {
    console.error("AppProviders.tsx..()", error)
  }, [])

  return (
    <Router>
      <ConstantsProvider {...constants}>
        <ContractProvider
          addressProvider={addressProvider}
          addressMap={addressMap}
        >
          <ApolloProvider client={client}>
            <OperationBroadcaster
              dependency={operationGlobalDependency}
              errorReporter={operationBroadcasterErrorReporter}
            >
              <QueryDependencyProvider
                client={client}
                address={address}
                onError={onQueryError}
              >
                <BankProvider>{children}</BankProvider>
              </QueryDependencyProvider>
            </OperationBroadcaster>
          </ApolloProvider>
        </ContractProvider>
      </ConstantsProvider>
    </Router>
  )
}

const operationBroadcasterErrorReporter = captureException
export function AppProviders({
  children,
  enableWatchConnection = true,
}: {
  children: ReactNode
  enableWatchConnection?: boolean
}) {
  return (
    <ChromeExtensionWalletProvider
      defaultNetwork={defaultNetwork}
      enableWatchConnection={enableWatchConnection}
    >
      <Providers>{children}</Providers>
    </ChromeExtensionWalletProvider>
  )
}
