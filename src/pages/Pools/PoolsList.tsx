import { useRouteMatch } from "react-router-dom"
import { useContract, useContractsAddress, useRefetch } from "../../hooks"
import { BalanceKey } from "../../hooks/contractKeys"

import Grid from "../../components/Grid"
import StakeItemCard from "../../components/StakeItemCard"
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
import { AUST, T14UST, T21UST } from "../../constants"

const PoolsList = () => {
  const keys = [BalanceKey.LPSTAKED, BalanceKey.LPSTAKABLE]
  const { url } = useRouteMatch()
  const { loading } = useRefetch(keys)
  const { blocksPerYear } = useConstants()
  const { dashboard } = useDashboard(StatsNetwork.TERRA)
  const {
    data: { marketStatus },
  } = useInterest()
  const { getToken } = useContractsAddress()
  const { find } = useContract()
  const apy = useMemo(() => currentAPY(marketStatus, blocksPerYear), [
    blocksPerYear,
    marketStatus,
  ])

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
      tickets: find(BalanceKey.TOKEN, getToken(AUST)),
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
      tickets: find(BalanceKey.TOKEN, getToken(T14UST)),
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
      tickets: find(BalanceKey.TOKEN, getToken(T21UST)),
    },
  ]

  return (
    <article>
      <LoadingTitle className={styles.encourage} loading={loading}>
        <PoolsListTitle />
      </LoadingTitle>

      <Grid wrap={3}>
        {pricePools.map((item) => (
          <StakeItemCard {...item} key={item.id} />
        ))}
      </Grid>
    </article>
  )
}

export default PoolsList
