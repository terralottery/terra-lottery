import { useRouteMatch } from "react-router-dom"

import { MIR, UUSD } from "../../constants"
import { minus, gt, number } from "../../libs/math"
import { useRefetch } from "../../hooks"
import { useContract, useContractsAddress } from "../../hooks"
import { BalanceKey, AssetInfoKey } from "../../hooks/contractKeys"
import useAssetStats from "../../statistics/useAssetStats"

import Grid from "../../components/Grid"
import StakeItemCard from "../../components/StakeItemCard"
import LoadingTitle from "../../components/LoadingTitle"
import CountWithResult from "../../containers/CountWithResult"
import usePool from "../../forms/usePool"

import PoolsListTitle from "./PoolsListTitle"
import styles from "./PoolsList.module.scss"
import { useMemo } from "react"
import big from "big.js"
import { currentAPY } from "../Dashboard/DashboardHeader"
import { useInterest } from "../../graphql/queries/interest"
import { useConstants } from "../../contexts/contants"

const PoolsList = () => {
  const keys = [BalanceKey.LPSTAKED, BalanceKey.LPSTAKABLE]
  const { url } = useRouteMatch()
  const { loading } = useRefetch(keys)

  /* context */
  const { listed, getSymbol } = useContractsAddress()
  const { find } = useContract()
  const stats = useAssetStats()
  const { apr } = stats
  const getPool = usePool()
  const { blocksPerYear } = useConstants()
  const {
    data: { marketStatus },
  } = useInterest()

  const apy = useMemo(() => currentAPY(marketStatus, blocksPerYear), [
    blocksPerYear,
    marketStatus,
  ])

  const ticketApy = Number(big(apy).toFixed()) / 2

  const getItem = ({ token }: ListedItem) => {
    const apy = stats["apy"][token] ?? "0"
    const apr = stats["apr"][token] ?? "0"
    const symbol = getSymbol(token)

    const totalStakedLP = find(AssetInfoKey.LPTOTALSTAKED, token)
    const { fromLP } = getPool({ amount: totalStakedLP, token })

    return {
      token,
      symbol,
      staked: gt(find(BalanceKey.LPSTAKED, token), 0),
      stakable: gt(find(BalanceKey.LPSTAKABLE, token), 0),
      apr,
      apy,
      totalStaked: (
        <CountWithResult
          keys={[AssetInfoKey.LPTOTALSTAKED]}
          symbol={UUSD}
          integer
        >
          {fromLP.value}
        </CountWithResult>
      ),
      to: `${url}/${token}`,
      emphasize: symbol === MIR,
    }
  }

  const pricePools = [
    {
      lpToken: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
      name: "UST - 7d Lottery",
      symbol: "UST",
      token: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
      apy: ticketApy,
      to: `${url}/terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu`,
      participating: true,
    },
    {
      lpToken: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
      name: "UST - 14d Lottery",
      symbol: "UST",
      token: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
      apy: ticketApy,
      to: `${url}/terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu`,
      participating: true,
    },
    {
      lpToken: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
      name: "UST - 21d Lottery",
      symbol: "UST",
      token: "terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu",
      apy: ticketApy,
      to: `${url}/terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu`,
      participating: true,
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
