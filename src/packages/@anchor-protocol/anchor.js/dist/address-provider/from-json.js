Object.defineProperty(exports, "__esModule", { value: true })
exports.AddressProviderFromJson = void 0
class AddressProviderFromJson {
  constructor(data) {
    this.data = data
  }
  blunaReward() {
    return this.data.blunaReward
  }
  blunaHub() {
    return this.data.bLunaHub
  }
  blunaToken() {
    return this.data.blunaToken
  }
  market() {
    return this.data.mmMarket
  }
  custody() {
    return this.data.mmCustody
  }
  overseer() {
    return this.data.mmOverseer
  }
  aTerra() {
    return this.data.aTerra
  }
  oracle() {
    return this.data.mmOracle
  }
  interest() {
    return this.data.mmInterestModel
  }
  liquidation() {
    return this.data.mmLiquidation
  }
  terraswapFactory() {
    return this.data.terraswapFactory
  }
  terraswapblunaLunaPair() {
    return this.data.terraswapblunaLunaPair
  }
  terraswapblunaLunaLPToken() {
    return this.data.terraswapblunaLunaLPToken
  }
  gov() {
    return this.data.gov
  }
  terraswapAncUstPair() {
    return this.data.terraswapAncUstPair
  }
  terraswapAncUstLPToken() {
    return this.data.terraswapAncUstLPToken
  }
  collector() {
    return this.data.collector
  }
  staking() {
    return this.data.staking
  }
  community() {
    return this.data.community
  }
  distributor() {
    return this.data.distributor
  }
  ANC() {
    return this.data.ANC
  }
  MIR() {
    return this.data.MIR
  }
  airdrop() {
    return this.data.airdrop
  }
  investorLock() {
    return this.data.vesting
  }
  teamLock() {
    return this.data.team
  }
}
exports.AddressProviderFromJson = AddressProviderFromJson
//# sourceMappingURL=from-json.js.map
