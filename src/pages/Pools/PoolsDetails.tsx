import { useParams } from "react-router-dom"
import useHash from "../../libs/useHash"
import Page from "../../components/Page"
import PoolDetailsHeader from "../../components/PoolDetailsHeader"
import StakeForm from "../../forms/StakeForm"
import { poolName, Type } from "../Pools"
import {
  T7UST,
  T14UST,
  T21UST,
  UST,
  UUSD,
  T21LUNA,
  T7ANC,
  T7MIR,
  MIR,
  ULUNA,
  ANC,
} from "../../constants"
import { columbusContractAddresses } from "../AppProviders"
import { useBank } from "../../contexts/bank"

const PoolsDetails = () => {
  const { token } = useParams<{ token: string }>()
  const { hash: type } = useHash<Type>(Type.STAKE)
  const tab = { tabs: [Type.STAKE, Type.UNSTAKE], current: type }
  const bank = useBank()
  let name = poolName.T7UST
  let contractAddresses = [
    columbusContractAddresses.mmMarket,
    columbusContractAddresses.aTerra,
  ]
  let tokenSymbol = UST
  let coin = UUSD
  let poolToken = T7UST
  let balances = [
    bank.userBalances.uUSD.toString(),
    bank.userBalances.uaUST.toString(),
  ]
  let lockDuration = "7 days"
  let message = {
    deposit_stable: {},
  }

  switch (token) {
    case "t14ust":
      name = poolName.T14UST
      poolToken = T14UST
      lockDuration = "14 days"
      balances = [bank.userBalances.uUSD.toString(), "0"]
      break

    case "t21ust":
      name = poolName.T21UST
      poolToken = T21UST
      lockDuration = "21 days"
      balances = [bank.userBalances.uUSD.toString(), "0"]
      break

    case "t7mir":
      name = poolName.T7MIR
      poolToken = T7MIR
      lockDuration = "7 days"
      coin = MIR
      tokenSymbol = MIR
      balances = [bank.userBalances.uMIR.toString(), "0"]
      break

    case "t7anc":
      name = poolName.T7ANC
      poolToken = T7ANC
      coin = ANC
      tokenSymbol = ANC
      lockDuration = "7 days"
      balances = [bank.userBalances.uANC.toString(), "0"]
      break

    case "t21luna":
      name = poolName.T21LUNA
      poolToken = T21LUNA
      coin = ULUNA
      tokenSymbol = "LUNA"
      lockDuration = "21 days"
      balances = [bank.userBalances.uLuna.toString(), "0"]
      break
  }

  return (
    <Page
      title={<PoolDetailsHeader name={name}>{tokenSymbol}</PoolDetailsHeader>}
    >
      {type && (
        <StakeForm
          poolName={name}
          type={type}
          coin={coin}
          stakedToken={poolToken}
          tokenSymbol={tokenSymbol}
          contracts={contractAddresses}
          lockDuration={lockDuration}
          message={message}
          tab={tab}
          key={type}
          balances={balances}
        />
      )}
    </Page>
  )
}

export default PoolsDetails
