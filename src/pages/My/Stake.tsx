import { UUSD } from "../../constants"
import MESSAGE from "../../lang/MESSAGE.json"
import Tooltip from "../../lang/Tooltip.json"
import { gt } from "../../libs/math"
import { formatAsset } from "../../libs/parse"
import { getPath, MenuKey } from "../../routes"

import Card from "../../components/Card"
import Dl from "../../components/Dl"
import LinkButton from "../../components/LinkButton"
import { TooltipIcon } from "../../components/Tooltip"
import { menu as stakeMenu, MenuKey as StakeMenuKey } from "../Pools"
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

const Stake = ({ loading, dataSource, ...props }: Props) => {
  const { totalRewards, totalRewardsValue } = props

  const claimAll = {
    to: getPath(MenuKey.POOLS) + stakeMenu[StakeMenuKey.CLAIMALL].path,
    className: "desktop",
    children: StakeMenuKey.CLAIMALL,
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
          title: "Total Staking Rewards:",
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

export default Stake
