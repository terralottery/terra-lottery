import Tooltip from "../../lang/Tooltip.json"
import { TooltipIcon } from "../../components/Tooltip"

const PoolsListTitle = () => {
  const tooltip = (
    <section>
      <article>
        <p>{Tooltip.Lottery.Title}</p>
      </article>

      <article>
        <h1>Tickets</h1>
        <p>{Tooltip.Lottery.Tickets}</p>
      </article>

      <article>
        <h1>Jackpot</h1>
        <p>{Tooltip.Lottery.Jackpot}</p>
      </article>
    </section>
  )

  return (
    <TooltipIcon content={tooltip}>
      <p>Earn UST by playing the Lottery!</p>
    </TooltipIcon>
  )
}

export default PoolsListTitle
