import { useLazyContractQueries } from "../useContractQueries"

export default (address: string) => {
  const generate = ({ ticketToken }: ListedItem) => {
    return { contract: ticketToken, msg: { balance: { address } } }
  }

  const query = useLazyContractQueries<Balance>(generate)
  return query
}
