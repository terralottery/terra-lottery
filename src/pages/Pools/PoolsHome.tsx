import { useRouteMatch } from "react-router-dom"
import { gt } from "../../libs/math"
import { useContract, useRefetch } from "../../hooks"
import { BalanceKey } from "../../hooks/contractKeys"
import Page from "../../components/Page"
import LinkButton from "../../components/LinkButton"
import { menu, MenuKey } from "../Pools"
import PoolsList from "./PoolsList"

const PoolsHome = () => {
  const { url } = useRouteMatch()
  const { rewards } = useContract()
  useRefetch([BalanceKey.REWARD, BalanceKey.LPSTAKED])

  const link = {
    to: url + menu[MenuKey.CLAIMALL].path,
    children: MenuKey.CLAIMALL,
    disabled: !gt(rewards, 0),
    outline: true,
  }

  return (
    <Page
      title={MenuKey.INDEX}
      doc="/user-guide/getting-started/stake"
      action={<LinkButton {...link} />}
    >
      <PoolsList />
    </Page>
  )
}

export default PoolsHome
