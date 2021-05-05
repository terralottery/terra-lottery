import { useRefetch } from "../../hooks"
import { BalanceKey } from "../../hooks/contractKeys"
import Page from "../../components/Page"
import { MenuKey } from "../Pools"
import PoolsList from "./PoolsList"

const PoolsHome = () => {
  useRefetch([BalanceKey.REWARD, BalanceKey.LPSTAKED])

  return (
    <Page title={MenuKey.INDEX} doc="/user-guide/getting-started/stake">
      <PoolsList />
    </Page>
  )
}

export default PoolsHome
