import { useMemo, useState } from "react"
import { ReactNode, HTMLAttributes, FormEvent } from "react"
import { Msg } from "@terra-money/terra.js"

import MESSAGE from "../lang/MESSAGE.json"
import Tooltip from "../lang/Tooltip.json"
import { UUSD } from "../constants"
import { gt, sum } from "../libs/math"
import useHash from "../libs/useHash"
import extension, { PostResponse } from "../terra/extension"
import { useContract, useSettings, useWallet } from "../hooks"
import useTax from "../graphql/useTax"

import Container from "../components/Container"
import Tab from "../components/Tab"
import Card from "../components/Card"
import Confirm from "../components/Confirm"
import FormFeedback from "../components/FormFeedback"
import Button from "../components/Button"
import Count from "../components/Count"
import { TooltipIcon } from "../components/Tooltip"
import Result from "./Result"
import { depositTxFee } from "../libs/depositTxFees"
import { useBank } from "../contexts/bank"
import { uUST } from "@anchor-protocol/types"
import type { UST } from "@anchor-protocol/types"
import useFee from "../graphql/useFee"

interface Props {
  data: Msg[]
  memo?: string

  /** Form information */
  contents?: Content[]
  /** uusd amount for tax calculation */
  pretax?: string
  /** Exclude tax from the contract */
  deduct?: boolean
  /** Form feedback */
  messages?: ReactNode[]
  value?: string

  /** Submit disabled */
  disabled?: boolean
  /** Submit label */
  label?: string

  /** Render tab */
  tab?: Tab
  /** Form event */
  attrs?: HTMLAttributes<HTMLFormElement>

  /** Parser for results */
  parseTx?: ResultParser

  children?: ReactNode
}

export const FormContainer = ({ data: msgs, memo, ...props }: Props) => {
  const { contents, messages, label, tab, children, value } = props
  const { attrs, pretax, deduct, parseTx = () => [] } = props

  /* context */
  const { hash } = useHash()
  const { agreementState } = useSettings()
  const [hasAgreed] = agreementState

  const { uusd, result } = useContract()
  const { address, connect } = useWallet()
  const { loading } = result.uusd

  /* tax */
  const fixedGas = 250000 as uUST<number>
  const depositAmount = value as UST
  const bank = useBank()
  const transactionFee = useMemo(
    () => depositTxFee(depositAmount, bank, fixedGas),
    [bank, depositAmount, fixedGas]
  )

  const fee = useFee()
  const { gas, gasPrice } = fee
  const { calcTax, loading: loadingTax } = useTax()
  const tax = pretax ? calcTax(pretax) : "0"
  const uusdAmount = !deduct
    ? sum([pretax ?? "0", tax, transactionFee?.toString() ?? "0"])
    : transactionFee?.toString() ?? "0"

  const invalid =
    address && !loading && !gt(uusd, uusdAmount)
      ? ["Not enough UST"]
      : undefined

  /* confirm */
  const confirm = () => hasAgreed && submit()

  /* submit */
  const [submitted, setSubmitted] = useState(false)
  const [response, setResponse] = useState<PostResponse>()
  const disabled =
    loadingTax || props.disabled || invalid || submitted || !msgs?.length

  const submit = async () => {
    setSubmitted(true)

    const response = await extension.post(
      { msgs, memo },
      {
        amount: Math.ceil(Number(transactionFee!.toString())),
        gas: gas,
        gasPrice: gasPrice,
        tax: !deduct ? tax : undefined,
      }
    )
    setResponse(response)
  }

  /* reset */
  const reset = () => {
    setSubmitted(false)
    setResponse(undefined)
  }

  /* event */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    !disabled && submit()
  }

  /* render */
  const render = (children: ReactNode | ((button: ReactNode) => ReactNode)) => {
    const next = address
      ? {
          onClick: confirm,
          children: label ?? hash ?? "Submit",
          loading: submitted,
          disabled,
        }
      : {
          onClick: connect,
          children: MESSAGE.Form.Button.ConnectWallet,
        }

    const txFee = (
      <Count symbol={UUSD} dp={3}>
        {transactionFee?.toString() ?? "0"}
      </Count>
    )

    const form = (
      <>
        {children}

        {contents && (
          <Confirm
            list={[
              ...contents,
              {
                title: (
                  <TooltipIcon content={Tooltip.Forms.TxFee}>
                    Tx Fee
                  </TooltipIcon>
                ),
                content: txFee,
              },
            ]}
          />
        )}

        {(invalid ?? messages)?.map((message, index) => (
          <FormFeedback key={index}>{message}</FormFeedback>
        ))}

        <Button {...next} type="button" size="lg" submit />
      </>
    )

    return tab ? <Tab {...tab}>{form}</Tab> : <Card lg>{form}</Card>
  }

  return (
    <Container sm>
      {response ? (
        <Result {...response} parseTx={parseTx} onFailure={reset} />
      ) : (
        <form {...attrs} onSubmit={handleSubmit}>
          {render(children)}
        </form>
      )}
    </Container>
  )
}

export default FormContainer
