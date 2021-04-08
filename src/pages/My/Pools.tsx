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

interface Data extends ListedItem {
  apr?: string
  staked: string
  stakable: string
  reward?: string
  gov?: boolean
}

interface Props {
  loading: boolean
  totalRewards: string
  totalRewardsValue: string
  dataSource: Data[]
}

const Pools = ({ loading, dataSource, ...props }: Props) => {
  const { totalRewards, totalRewardsValue } = props

  const claimAll = {
    to: getPath(MenuKey.POOLS) + poolsMenu[PoolsMenuKey.CLAIMALL].path,
    className: "desktop",
    children: PoolsMenuKey.CLAIMALL,
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
          title: "Current Tickets:",
          content: formatAsset(totalRewardsValue, "Tickets"),
        },
        {
          title: "Total earned interest:",
          content: formatAsset(totalRewardsValue, UUSD),
        },
        {
          title: "Total Lottery Winnings:",
          content: formatAsset(totalRewardsValue, UUSD),
        },
      ]}
    />
  )

  return (
    <Card
      title="Your Lottery Overview"
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
