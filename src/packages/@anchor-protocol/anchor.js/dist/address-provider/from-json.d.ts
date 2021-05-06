import { AddressProvider } from "./provider"
export interface AddressMap {
  bLunaHub: string
  blunaToken: string
  blunaReward: string
  blunaAirdrop: string
  mmInterestModel: string
  mmOracle: string
  mmMarket: string
  mmOverseer: string
  mmCustody: string
  mmLiquidation: string
  mmDistributionModel: string
  terraswapFactory: string
  aTerra: string
  terraswapblunaLunaPair: string
  terraswapblunaLunaLPToken: string
  terraswapAncUstPair: string
  terraswapAncUstLPToken: string
  gov: string
  distributor: string
  collector: string
  community: string
  staking: string
  ANC: string
  MIR: string
  airdrop: string
  vesting: string
  team: string
}
export declare type AllowedAddressKeys = keyof AddressMap
export declare class AddressProviderFromJson implements AddressProvider {
  private data
  constructor(data: AddressMap)
  blunaReward(): string
  blunaHub(): string
  blunaToken(): string
  market(): string
  custody(): string
  overseer(): string
  aTerra(): string
  oracle(): string
  interest(): string
  liquidation(): string
  terraswapFactory(): string
  terraswapblunaLunaPair(): string
  terraswapblunaLunaLPToken(): string
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
