Object.defineProperty(exports, "__esModule", { value: true })
exports.AddressProviderFromEnvVar = void 0
const react_app_prefix_1 = require("./react-app-prefix")
class AddressProviderFromEnvVar {
  blunaReward() {
    return getFromEnv("bAssetReward")
  }
  blunaHub() {
    return getFromEnv("bLuna")
  }
  blunaToken() {
    return getFromEnv("bAssetToken")
  }
  bAsset() {
    return getFromEnv("bAsset")
  }
  market() {
    return getFromEnv("mmMarket")
  }
  custody() {
    return getFromEnv("mmCustody")
  }
  overseer() {
    return getFromEnv("mmOverseer")
  }
  aTerra() {
    return getFromEnv("aUST")
  }
  oracle() {
    return getFromEnv("mmOracle")
  }
  interest() {
    return getFromEnv("mmInterest")
  }
  liquidation() {
    return getFromEnv("mmLiquidation")
  }
  terraswapFactory() {
    return getFromEnv("terraswapFactory")
  }
  terraswapblunaLunaPair() {
    return getFromEnv("bLunaBurnPair")
  }
  terraswapblunaLunaLPToken(nativeDenom) {
    return getFromEnv(`blunaUlunaToken${nativeDenom}`)
  }
  gov() {
    return getFromEnv(`gov`)
  }
  terraswapAncUstPair() {
    return getFromEnv(`anchorUusdPair`)
  }
  terraswapAncUstLPToken() {
    return getFromEnv(`anchorUusdPair`)
  }
  collector() {
    return getFromEnv(`collector`)
  }
  staking() {
    return getFromEnv(`staking`)
  }
  community() {
    return getFromEnv(`community`)
  }
  distributor() {
    return getFromEnv(`distributor`)
  }
  ANC() {
    return getFromEnv(`token`)
  }
  MIR() {
    return getFromEnv(`token`)
  }
  airdrop() {
    return getFromEnv(`airdrop`)
  }
  investorLock() {
    return getFromEnv(`vesting`)
  }
  teamLock() {
    return getFromEnv(`team`)
  }
}
exports.AddressProviderFromEnvVar = AddressProviderFromEnvVar
function getFromEnv(key) {
  const val = process.env[react_app_prefix_1.reactifyEnv(key)]
  if (typeof val === "undefined") {
    throw new Error(`address provider could not resolve key ${key}`)
  }
  return val
}
//# sourceMappingURL=from-env.js.map
