import { UUSD } from "../../constants"
import MESSAGE from "../../lang/MESSAGE.json"
import { gt } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import { getPath, MenuKey } from "../../routes"

import Card from "../../components/Card"
import Dl from "../../components/Dl"
import LinkButton from "../../components/LinkButton"
import { menu as poolsMenu, MenuKey as PoolsMenuKey } from "../Pools"
import NoAssets from "./NoAssets"

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

  const claimAll = {
    to: getPath(MenuKey.POOLS) + poolsMenu[PoolsMenuKey.CLAIMALL].path,
    className: "desktop",
    children: `Claim ${formatAsset(String(totalEarnings), UUSD)}`,
    disabled: !gt(totalRewards, 0),
    color: "aqua",
    size: "sm" as const,
    outline: true,
  }

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

  return (
    <Card
      title="Your Lottery Earnings"
      action={!loading && <LinkButton {...claimAll} />}
      description={description}
      loading={loading}
    >
      <NoAssets
        description={MESSAGE.MyPage.Empty.Staked}
        link={MenuKey.POOLS}
      />
    </Card>
  )
}

export default Pools
