import { formatAsset } from "../../libs/parse"
import { findValue } from "./receiptHelpers"

export default () => (logs: TxLog[]) => {
  const val = findValue(logs)

  const amount = val("amount")

  /* contents */
  return [
    {
      title: "Amount",
      content: formatAsset(amount, "Tickets"),
    },
  ]
}
