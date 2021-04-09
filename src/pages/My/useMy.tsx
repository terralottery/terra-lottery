import { minus, sum } from "../../libs/math"
import { useDeposit } from "../../graphql/queries/totalDeposit"
import { useMemo } from "react"
import type { uaUST, uUST } from "@anchor-protocol/types"
import { cw20, moneyMarket } from "@anchor-protocol/types"
import big, { Big } from "big.js"
import { useInterestEarned } from "../../graphql/queries/interestEarned"

export function totalDepositUST(
  aUSTBalance: cw20.BalanceResponse<uaUST> | undefined,
  epochState: moneyMarket.market.EpochStateResponse | undefined
) {
  return big(aUSTBalance?.balance ?? "0").mul(
    epochState?.exchange_rate ?? "1"
  ) as uUST<Big>
}

const useMy = () => {
  const {
    data: { aUSTBalance, exchangeRate },
  } = useDeposit()

  const {
    data: { interestEarned },
  } = useInterestEarned("total")

  const totalDeposit = useMemo(
    () => totalDepositUST(aUSTBalance, exchangeRate),
    [aUSTBalance, exchangeRate]
  )

  const aust = big(totalDeposit).toFixed() ?? "0"

  //current UST balance
  //const { uusd } = useContract()
  const values = {
    aust: aust,
    reward: interestEarned ?? "0",
  }

  const total = { value: calcTotalValue(values), loading: !aust }

  const pools = {
    dataSource: ["achor"],
    totalRewards: interestEarned ?? "0",
    totalWinnings: "0",
    totalTickets: aust,
    loading: !interestEarned,
  }

  return { pools, total }
}

export default useMy

/* calc */
interface Values {
  uusd?: string
  aust?: string
  reward: string
}

export const calcTotalValue = (values: Values) => {
  const { reward } = values
  const tokenBalance = !!values.uusd ? values.uusd ?? "0" : values.aust ?? "0"

  return minus(sum([reward, tokenBalance]))
}
