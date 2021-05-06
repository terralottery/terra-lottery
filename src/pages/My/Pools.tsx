import { UUSD } from "../../constants"
import MESSAGE from "../../lang/MESSAGE.json"
import { gt } from "../../libs/math"
import { format, formatAsset } from "../../libs/parse"
import { getPath, MenuKey } from "../../routes"

import Card from "../../components/Card"
import Dl from "../../components/Dl"
import LinkButton from "../../components/LinkButton"
import {
  menu as poolsMenu,
  MenuKey as PoolsMenuKey,
  poolName,
  Type,
} from "../Pools"
import NoAssets from "./NoAssets"
import { useBank } from "../../contexts/bank"
import Table from "../../components/Table"
import { percent } from "../../libs/num"
import { useMemo } from "react"
import big from "big.js"
import { currentAPY } from "../Dashboard/DashboardHeader"
import { useConstants } from "../../contexts/contants"
import { useInterest } from "../../graphql/queries/interest"
import DashboardActions from "../../components/DashboardActions"

interface Props {
  totalTickets: string
  totalRewards: string
  totalWinnings: string
  dataSource: string[]
  loading: boolean
}

const Pools = ({ loading, dataSource, ...props }: Props) => {
  const { totalRewards, totalWinnings, totalTickets } = props
  const totalEarnings = Number(totalRewards) + Number(totalWinnings)
  const bank = useBank()
  const { blocksPerYear } = useConstants()
  const claimAll = {
    to: getPath(MenuKey.POOLS) + poolsMenu[PoolsMenuKey.CLAIMALL].path,
    className: "desktop",
    children: `Claim ${formatAsset(String(totalEarnings), UUSD)}`,
    disabled: !gt(totalRewards, 0),
    color: "aqua",
    size: "sm" as const,
    outline: true,
  }
  const {
    data: { marketStatus },
  } = useInterest()
  const apy = useMemo(() => currentAPY(marketStatus, blocksPerYear), [
    blocksPerYear,
    marketStatus,
  ])

  const ticketApy = Number(big(apy).toFixed()) / 2
  const dataExists = !!dataSource.length
  const description = dataExists && (
    <Dl
      list={[
        {
          title: "Total Tickets Value:",
          content: formatAsset(totalTickets, UUSD),
        },
        {
          title: "Total earned interest:",
          content: formatAsset(totalRewards, UUSD),
        },
        {
          title: "Total Lottery Winnings:",
          content: formatAsset(totalWinnings, UUSD),
        },
      ]}
    />
  )

  const lotteryPositions = [
    {
      lottery: poolName.T7UST,
      apy: ticketApy,
      balance: bank.userBalances.uaUST.toString(),
      value: totalTickets,
      chances: "1:17,837",
      token: "t7ust",
    },
  ]

  return (
    <Card
      title="Your Lottery Earnings"
      action={!loading && <LinkButton {...claimAll} />}
      description={description}
      loading={loading}
    >
      {Number(bank.userBalances.uaUST.toString()) > 0 ? (
        <Table
          columns={[
            {
              key: "lottery",
              title: "Lottery",
              render: (value) => {
                return value
              },
              bold: true,
            },
            {
              key: "apy",
              title: "APY",
              render: (value) => {
                return percent(value)
              },
              align: "center",
            },
            {
              key: "balance",
              title: "Tickets",
              render: (value) => {
                return format(value, "Tickets")
              },
              align: "right",
            },
            {
              key: "value",
              title: "Current Value",
              render: (value) => {
                return formatAsset(value, UUSD)
              },
              align: "right",
            },
            {
              key: "chances",
              title: "Winning Odds",
              render: (value) => {
                return value
              },
              align: "right",
            },
            {
              key: "actions",
              dataIndex: "token",
              render: (value) => {
                const stake = `${getPath(MenuKey.POOLS)}/${value}`
                const unstake = `${getPath(MenuKey.POOLS)}/${value}`

                const list = [
                  {
                    to: { pathname: stake, hash: Type.STAKE },
                    children: Type.STAKE,
                  },
                  {
                    to: { pathname: unstake, hash: Type.UNSTAKE },
                    children: Type.UNSTAKE,
                  },
                ]

                return <DashboardActions list={list} />
              },
              align: "right",
              fixed: "right",
            },
          ]}
          dataSource={lotteryPositions}
        />
      ) : (
        <NoAssets
          description={MESSAGE.MyPage.Empty.Staked}
          link={MenuKey.POOLS}
        />
      )}
    </Card>
  )
}

export default Pools
