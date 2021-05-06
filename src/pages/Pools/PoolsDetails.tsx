import { useParams } from "react-router-dom"
import useHash from "../../libs/useHash"
import Page from "../../components/Page"
import StakeDetailsHeader from "../../components/StakeDetailsHeader"
import StakeForm from "../../forms/StakeForm"
import { poolName, Type } from "../Pools"
import { AUST, T14UST, T21UST, UST, UUSD } from "../../constants"
import { columbusContractAddresses } from "../AppProviders"

const PoolsDetails = () => {
  const { token } = useParams<{ token: string }>()
  const { hash: type } = useHash<Type>(Type.STAKE)
  const tab = { tabs: [Type.STAKE, Type.UNSTAKE], current: type }
  let name = poolName.T7UST
  let contractAddress = columbusContractAddresses.mmMarket
  let tokenSymbol = UST
  let stakeAddress = UUSD
  let poolToken = AUST
  let lockDuration = "7 days"

  switch (token) {
    case "t14ust":
      name = poolName.T14UST
      contractAddress = columbusContractAddresses.mmMarket
      tokenSymbol = UST
      stakeAddress = UUSD
      poolToken = T14UST
      lockDuration = "14 days"
      break

    case "t21ust":
      name = poolName.T21UST
      contractAddress = columbusContractAddresses.mmMarket
      tokenSymbol = UST
      stakeAddress = UUSD
      poolToken = T21UST
      lockDuration = "21 days"
      break
  }

  return (
    <Page
      title={<StakeDetailsHeader name={name}>{tokenSymbol}</StakeDetailsHeader>}
    >
      {type && (
        <StakeForm
          poolName={name}
          type={type}
          token={stakeAddress}
          stakedToken={poolToken}
          tokenSymbol={tokenSymbol}
          contract={contractAddress}
          lockDuration={lockDuration}
          tab={tab}
          key={type}
        />
      )}
    </Page>
  )
}

export default PoolsDetails
