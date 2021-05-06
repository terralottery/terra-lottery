import { UUSD } from "../constants"
import { AccountInfoKey } from "../hooks/contractKeys"
import Count from "../components/Count"
import WithResult from "../containers/WithResult"
import { useBank } from "../contexts/bank"

const Balance = () => {
  const bank = useBank()
  const renderError = () => <p className="red">Error</p>

  return (
    <WithResult
      keys={[AccountInfoKey.UUSD]}
      renderError={renderError}
      size={21}
    >
      <Count symbol={UUSD}>{bank.userBalances.uUSD.toString()}</Count>
    </WithResult>
  )
}

export default Balance
