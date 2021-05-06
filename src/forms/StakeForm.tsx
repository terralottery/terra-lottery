import Tooltip from "../lang/Tooltip.json"
import useNewContractMsg from "../terra/useNewContractMsg"
import { LP } from "../constants"
import { gt } from "../libs/math"
import { formatAsset, lookup, toAmount } from "../libs/parse"
import useForm from "../libs/useForm"
import { validate as v, placeholder, step, toBase64 } from "../libs/formHelpers"
import { renderBalance } from "../libs/formHelpers"
import { useContractsAddress, useRefetch, useWallet } from "../hooks"
import { BalanceKey } from "../hooks/contractKeys"

import FormGroup from "../components/FormGroup"
import FormFeedback from "../components/FormFeedback"
import { Type } from "../pages/Pools"
import useStakeReceipt from "./receipts/useStakeReceipt"
import FormContainer from "./FormContainer"
import { Coin, MsgExecuteContract } from "@terra-money/terra.js"

enum Key {
  value = "value",
}

interface Props {
  poolName: string
  type: Type
  coin: string
  stakedToken: string
  lockDuration: string
  tab: Tab
  message: {}
  tokenSymbol?: string
  contracts: string[]
  balances: string[]
}
const StakeForm = ({
  poolName,
  type,
  stakedToken,
  lockDuration,
  tab,
  message,
  contracts,
  tokenSymbol,
  coin,
  balances,
}: Props) => {
  const balanceKey = {
    [Type.STAKE]: BalanceKey.TOKEN,
    [Type.UNSTAKE]: BalanceKey.TOKEN,
  }[type as Type]

  /* context */
  const { getSymbol } = useContractsAddress()
  useRefetch([balanceKey, BalanceKey.TOKEN])

  const balance = type === Type.STAKE ? balances[0] : balances[1]

  /* form:validate */
  const validate = ({ value }: Values<Key>) => {
    const symbol = getSymbol(coin)
    return { [Key.value]: v.amount(value, { symbol, max: balance }) }
  }

  /* form:hook */
  const initial = { [Key.value]: "" }
  const form = useForm<Key>(initial, validate)
  const { values, setValue, getFields, attrs, invalid } = form
  const { value } = values
  const amount = toAmount(value)
  const symbol = getSymbol(coin)

  /* render:form */
  const max = balance
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
            content: formatAsset(amount, getSymbol(stakedToken)),
          },
        ]
      : [
          {
            title: `${poolName} Tickets`,
            content: formatAsset(amount, "Tickets"),
          },
        ]
    : []

  /* submit */
  const { address: sender } = useWallet()
  const newContractMsg = useNewContractMsg()
  const data = {
    [Type.STAKE]: [
      new MsgExecuteContract(sender, contracts[0], message, [
        new Coin(coin, amount),
      ]),
    ],
    [Type.UNSTAKE]: [
      newContractMsg(contracts[1], {
        send: {
          amount,
          contract: contracts[0],
          msg: toBase64({ redeem_stable: {} }),
        },
      }),
    ],
  }[type as Type]

  const messages = undefined

  const disabled = invalid

  /* result */
  const parseTx = useStakeReceipt()

  const container = {
    tab,
    attrs,
    contents,
    messages,
    amount,
    value,
    disabled,
    data,
    parseTx,
    type,
  }

  return (
    <FormContainer {...container}>
      <FormGroup {...fields[Key.value]} />

      {type === Type.UNSTAKE ? (
        <FormFeedback help>{Tooltip.My.UnlockedTickets}</FormFeedback>
      ) : (
        <FormFeedback help>
          {Tooltip.My.TicketLockDuration.replaceAll(
            "{{token}}",
            tokenSymbol ?? "LP"
          ).replaceAll("{{lockDuration}}", lockDuration)}
        </FormFeedback>
      )}
    </FormContainer>
  )
}

export default StakeForm
