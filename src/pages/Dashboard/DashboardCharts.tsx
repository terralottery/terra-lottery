import { last } from "ramda"
import { UUSD } from "../../constants"
import Tooltip from "../../lang/Tooltip.json"
import { lookup } from "../../libs/parse"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import Count from "../../components/Count"
import ChartContainer from "../../containers/ChartContainer"
import { TooltipIcon } from "../../components/Tooltip"

const DashboardCharts = (props: Partial<Dashboard>) => {
  const { liquidityHistory } = props

  return (
    <Grid wrap={2}>
      <Card>
        <Summary
          title={
            <TooltipIcon content={Tooltip.Chart.Tickets}>Tickets</TooltipIcon>
          }
        >
          <ChartContainer
            value={
              <Count symbol={UUSD} integer>
                {liquidityHistory ? last(liquidityHistory)?.value : "0"}
              </Count>
            }
            datasets={
              liquidityHistory ? toDatasets(liquidityHistory, UUSD) : []
            }
          />
        </Summary>
      </Card>

      <Card>
        <Summary
          title={
            <TooltipIcon content={Tooltip.Chart.Participants}>
              Total participating Wallets
            </TooltipIcon>
          }
        >
          <ChartContainer
            value={
              <Count symbol="Wallets" integer>
                {liquidityHistory ? last(liquidityHistory)?.value : "0"}
              </Count>
            }
            datasets={
              liquidityHistory ? toDatasets(liquidityHistory, "Wallets") : []
            }
            bar
          />
        </Summary>
      </Card>
    </Grid>
  )
}

export default DashboardCharts

/* helpers */
const toDatasets = (data: ChartItem[], symbol?: string) =>
  data.map(({ timestamp, value }) => {
    return { t: timestamp, y: lookup(value, symbol, { integer: true }) }
  })
