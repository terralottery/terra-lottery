import { AddressProvider } from "./provider"
export declare class AddressProviderFromEnvVar implements AddressProvider {
  blunaReward(): string
  blunaHub(): string
  blunaToken(): string
  bAsset(): string
  market(): string
  custody(): string
  overseer(): string
  aTerra(): string
  oracle(): string
  interest(): string
  liquidation(): string
  terraswapFactory(): string
  terraswapblunaLunaPair(): string
  terraswapblunaLunaLPToken(nativeDenom: string): string
  gov(): string
  terraswapAncUstPair(): string
  terraswapAncUstLPToken(): string
  collector(): string
  staking(): string
  community(): string
  distributor(): string
  ANC(): string
  MIR(): string
  airdrop(): string
  investorLock(): string
  teamLock(): string
}
