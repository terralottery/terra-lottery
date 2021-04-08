/* terra:network */
export const FINDER = "https://finder.terra.money"
export const EXTENSION = "https://terra.money/extension"
export const CHROME = "https://google.com/chrome"
export const DOCS = "https://docs.mirror.finance"

/* terra:configs */
export const BLOCK_TIME = 6500 // 6.5s

/* mirror:unit */
export const SMALLEST = 1e6
export const MIR = "MIR"
export const UUSD = "uusd"
export const UST = "UST"
export const LP = "LP"

/* mirror:configs */
export const GENESIS = 1607022000000
export const MAX_SPREAD = 0.01
export const MAX_MSG_LENGTH = 4096
export const COMMISSION = 0.003

/* network:settings */
export const TX_POLLING_INTERVAL = 1000
export const DEFAULT_EXT_NETWORK: ExtNetworkConfig = {
  name: "mainnet",
  chainID: "columbus-4",
  lcd: "https://lcd.terra.dev",
}

/* outbound */
export const TRADING_HOURS =
  "https://www.nasdaq.com/stock-market-trading-hours-for-nasdaq"

/* sentry */
export const DSN =
  "https://02aaefc8ecf04f2c9145ba2c78d0326f@o567291.ingest.sentry.io/5711071"
