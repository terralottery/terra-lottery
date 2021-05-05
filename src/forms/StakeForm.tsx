import Tooltip from "../lang/Tooltip.json"
import useNewContractMsg from "../terra/useNewContractMsg"
import { LP } from "../constants"
import { gt } from "../libs/math"
import { formatAsset, lookup, toAmount } from "../libs/parse"
import useForm from "../libs/useForm"
import { validate as v, placeholder, step } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { BalanceKey } from "../hooks/contractKeys"

import FormGroup from "../components/FormGroup"
import FormFeedback from "../components/FormFeedback"
import { Type } from "../pages/Pools"
import useStakeReceipt from "./receipts/useStakeReceipt"
import { toBase64 } from "../libs/formHelpers"
import FormContainer from "./FormContainer"

enum Key {
  value = "value",
}

interface Props {
  poolName: string
  type: Type
  token: string
  stakedToken: string
  tab: Tab
  tokenSymbol?: string
  gov?: boolean
  contract?: string
}

const StakeForm = ({
  poolName,
  type,
  token,
  stakedToken,
  tab,
  gov,
  contract,
  tokenSymbol,
}: Props) => {
  const balanceKey = {
    [Type.STAKE]: BalanceKey.TOKEN,
    [Type.UNSTAKE]: BalanceKey.TOKEN,
  }[type as Type]

  /* context */
  const { contracts, whitelist, getSymbol, getToken } = useContractsAddress()
  const { find } = useContract()
  useRefetch([balanceKey, BalanceKey.TOKEN])

  const getMax = () => {
    const balance =
      type === Type.UNSTAKE
        ? find(balanceKey, getToken(stakedToken))
        : find(balanceKey, token)

    return balance
  }

  /* form:validate */
  const validate = ({ value }: Values<Key>) => {
    const symbol = getSymbol(token)
    return { [Key.value]: v.amount(value, { symbol, max: getMax() }) }
  }

  /* form:hook */
  const initial = { [Key.value]: "" }
  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form
  const { value } = values
  const amount = toAmount(value)
  const symbol = getSymbol(token)

  /* render:form */
  const max = getMax()
  const fields = getFields({
    [Key.value]: {
      label: "Amount",
      input: {
        type: "number",
        step: step(symbol),
        placeholder: placeholder(symbol),
        autoFocus: true,
      },
      help: renderBalance(max, symbol),
      unit: type === Type.UNSTAKE ? getSymbol(stakedToken) : tokenSymbol ?? LP,
      max: gt(max, 0)
        ? () => setValue(Key.value, lookup(max, symbol))
        : undefined,
    },
  })

  const contents = !value
    ? undefined
    : gt(max, 0)
    ? type === Type.UNSTAKE
      ? [
          {
            title: `${poolName} Tickets`,
            content: formatAsset(max, "Tickets"),
          },
        ]
      : [
          {
            title: `${poolName} Tickets`,
            content: formatAsset(max, "Tickets"),
          },
        ]
    : []

  /* submit */
  const newContractMsg = useNewContractMsg()
  const { lpToken } = whitelist[token] ?? {}
  const assetToken = { asset_token: token }
  const data = {
    [Type.STAKE]: [
      newContractMsg(lpToken, {
        send: {
          amount,
          contract: contracts["staking"],
          msg: toBase64({ bond: assetToken }),
        },
      }),
    ],
    [Type.UNSTAKE]: [
      newContractMsg(contracts["staking"], {
        unbond: { ...assetToken, amount },
      }),
    ],
  }[type as Type]

  const messages = undefined

  const disabled = invalid

  /* result */
  const parseTx = useStakeReceipt(!!gov)

  const container = { tab, attrs, contents, messages, disabled, data, parseTx }

  return (
    <FormContainer {...container}>
      <FormGroup {...fields[Key.value]} />

      {gov && type === Type.STAKE && (
        <FormFeedback help>{Tooltip.My.GovReward}</FormFeedback>
      )}
    </FormContainer>
  )
}

export default StakeForm
