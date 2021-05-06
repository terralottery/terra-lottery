import { useLazyContractQueries } from "../useContractQueries"

export default () => {
  const generate = ({ ticketToken }: ListedItem) => {
    return { contract: ticketToken, msg: { token_info: {} } }
  }

  const query = useLazyContractQueries<TotalSupply>(generate)
  return query
}
