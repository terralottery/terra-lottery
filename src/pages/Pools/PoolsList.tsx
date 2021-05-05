import { useRouteMatch } from "react-router-dom"
import { useRefetch } from "../../hooks"
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
import useMy from "../My/useMy"

const PoolsList = () => {
  const keys = [BalanceKey.LPSTAKED, BalanceKey.LPSTAKABLE]
  const { url } = useRouteMatch()
  const { loading } = useRefetch(keys)
  const { blocksPerYear } = useConstants()
  const { dashboard } = useDashboard(StatsNetwork.TERRA)
  const {
    data: { marketStatus },
  } = useInterest()
  const { pools } = useMy()

  const apy = useMemo(() => currentAPY(marketStatus, blocksPerYear), [
    blocksPerYear,
    marketStatus,
  ])

  const ticketApy = Number(big(apy).toFixed()) / 2

  const pricePools = [
    {
      lpToken: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
      name: "UST - 7d Lottery",
      symbol: "UST",
      token: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
      apy: ticketApy,
      to: `${url}/terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu`,
      participating: true,
      nextDraw: getNextDraw("7d"),
      jackpot: dashboard?.totalValueLocked,
      tickets: pools?.totalTickets,
    },
    {
      lpToken: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
      name: "UST - 14d Lottery",
      symbol: "UST",
      token: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
      apy: ticketApy,
      to: `${url}/terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu`,
      participating: false,
      nextDraw: getNextDraw("14d"),
      jackpot: dashboard?.totalValueLocked,
    },
    {
      lpToken: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
      name: "UST - 21d Lottery",
      symbol: "UST",
      token: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
      apy: ticketApy,
      to: `${url}/terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu`,
      participating: false,
      nextDraw: getNextDraw("21d"),
      jackpot: dashboard?.totalValueLocked,
    },
  ]

  return (
    <article>
      <LoadingTitle className={styles.encourage} loading={loading}>
        <PoolsListTitle />
      </LoadingTitle>

      <Grid wrap={3}>
        {pricePools.map((item) => (
          <StakeItemCard {...item} key={item.name} />
        ))}
      </Grid>
    </article>
  )
}

export default PoolsList
