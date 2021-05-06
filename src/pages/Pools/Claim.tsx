import { useRouteMatch } from "react-router-dom"
import Page from "../../components/Page"
import ClaimForm from "../../forms/ClaimForm"
import PoolDetailsHeader from "../../components/PoolDetailsHeader"
import { useContractsAddress } from "../../hooks"
import { MenuKey } from "../Pools"

const Claim = () => {
  const { params } = useRouteMatch<{ token?: string }>()
  const { token } = params

  const { getSymbol } = useContractsAddress()
  const symbol = getSymbol(token)
  const title = symbol ? (
    <PoolDetailsHeader>{symbol}</PoolDetailsHeader>
  ) : (
    MenuKey.CLAIMALL
  )

  return (
    <Page title={title}>
      <ClaimForm token={token} />
    </Page>
  )
}

export default Claim
