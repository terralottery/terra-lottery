import { useRouteMatch } from "react-router-dom"
import { useRefetch } from "../../hooks"
import { BalanceKey } from "../../hooks/contractKeys"

import Grid from "../../components/Grid"
import PoolItemCard from "../../components/PoolItemCard"
import LoadingTitle from "../../components/LoadingTitle"
import PoolsListTitle from "./PoolsListTitle"
import styles from "./PoolsList.module.scss"
import { useMemo } from "react"
import big from "big.js"
import { currentAPY } from "../Dashboard/DashboardHeader"
import { useInterest } from "../../graphql/queries/interest"
import { useConstants } from "../../contexts/contants"
import { getNextDraw } from "../../components/Countdown"
import useDashboard, { StatsNetwork } from "../../statistics/useDashboard"
import { poolName } from "../Pools"
import { useBank } from "../../contexts/bank"

const PoolsList = () => {
  const keys = [BalanceKey.LPSTAKED, BalanceKey.LPSTAKABLE]
  const { url } = useRouteMatch()
  const { loading } = useRefetch(keys)
  const { blocksPerYear } = useConstants()
  const { dashboard } = useDashboard(StatsNetwork.TERRA)
  const {
    data: { marketStatus },
  } = useInterest()
  const apy = useMemo(() => currentAPY(marketStatus, blocksPerYear), [
    blocksPerYear,
    marketStatus,
  ])

  const bank = useBank()
  useRefetch([BalanceKey.TOKEN, BalanceKey.TOKEN])
  const ticketApy = Number(big(apy).toFixed()) / 2

  const pricePools = [
    {
      lpToken: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
      name: poolName.T7UST,
      symbol: "UST",
      id: "t7ust",
      apy: ticketApy,
      to: `${url}/t7ust`,
      nextDraw: getNextDraw("7d"),
      jackpot: dashboard?.latest24h?.feeVolume ?? "0",
      tickets: bank.userBalances.uaUST,
    },
    {
      lpToken: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
      name: poolName.T14UST,
      symbol: "UST",
      id: "t14ust",
      apy: ticketApy,
      to: `${url}/t14ust`,
      nextDraw: getNextDraw("14d"),
      jackpot: dashboard?.latest24h?.mirVolume ?? "0",
      tickets: "0",
    },
    {
      lpToken: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
      name: poolName.T21UST,
      symbol: "UST",
      id: "t21ust",
      apy: ticketApy,
      to: `${url}/t21ust`,
      nextDraw: getNextDraw("21d"),
      jackpot: dashboard?.latest24h?.volume ?? "0",
      tickets: "0",
    },
  ]

  return (
    <article>
      <LoadingTitle className={styles.encourage} loading={loading}>
        <PoolsListTitle />
      </LoadingTitle>

      <Grid wrap={3}>
        {pricePools.map((item) => (
          <PoolItemCard {...item} key={item.id} />
        ))}
      </Grid>
    </article>
  )
}

export default PoolsList
