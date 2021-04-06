import { uniq } from "ramda"
import { minus, sum } from "../../libs/math"
import { useRefetch } from "../../hooks"
import { AccountInfoKey } from "../../hooks/contractKeys"
import { DataKey, useContract } from "../../hooks/useContract"
import useMyStake from "./useMyStake"

const useMy = () => {
  const stake = useMyStake()

  const keys = uniq(
    [stake].reduce<DataKey[]>((acc, { keys }) => [...acc, ...keys], [])
  )

  const { data } = useRefetch([...keys, AccountInfoKey.UUSD])

  /* total */
  const { uusd } = useContract()
  const values = {
    uusd,
    reward: stake.totalRewardsValue,
  }

  const total = { value: calcTotalValue(values), loading: !data }

  return { stake, total }
}

export default useMy

/* calc */
interface Values {
  uusd: string
  reward: string
}

export const calcTotalValue = (values: Values) => {
  const { reward } = values
  const { uusd } = values

  return minus(sum([reward, uusd]))
}
