import { UUSD } from "../../constants"
import Tooltip from "../../lang/Tooltip.json"
import { percent } from "../../libs/num"
import { useRefetch } from "../../hooks"
import { PriceKey } from "../../hooks/contractKeys"
import { StatsNetwork } from "../../statistics/useDashboard"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Dl from "../../components/Dl"
import Summary from "../../components/Summary"
import Count from "../../components/Count"
import { TooltipIcon } from "../../components/Tooltip"
import { Countdown, getNextDraw } from "../../components/Countdown"
import Legend from "../../components/Legend"

interface Props extends Partial<Dashboard> {
  network: StatsNetwork
}

const DashboardHeader = ({ network, ...props }: Props) => {
  const { latest24h, totalValueLocked } = props
  const sevenDayEnd = getNextDraw("7d")
  const fourteenDayEnd = getNextDraw("14d")
  const twentyOneDayEnd = getNextDraw("21d")
  const currentApy = "0.1053"
  useRefetch([PriceKey.PAIR])

  return (
    <>
      <Grid>
        <Dl
          list={[
            {
              title: "Total Tickets:",
              content: (
                <TooltipIcon content={Tooltip.Dashboard.Tickets}>
                  <Count integer>{latest24h?.transactions}</Count>
                </TooltipIcon>
              ),
            },
          ]}
        />
      </Grid>

      <Grid>
        <Card>
          <Summary
            title={
              <TooltipIcon content={Tooltip.Dashboard.APY}>
                Lottery Tickets APY
              </TooltipIcon>
            }
          >
            <Count format={(value) => percent(value, 2)}>{currentApy}</Count>
          </Summary>
        </Card>

        <Card>
          <Summary
            title={
              <TooltipIcon content={Tooltip.Dashboard.sevenDay}>
                7d Lottery Jackpot
              </TooltipIcon>
            }
          >
            <Count symbol={UUSD} integer>
              {totalValueLocked}
            </Count>
          </Summary>
          <Legend title="Next draw in:">
            <Countdown end={sevenDayEnd} />
          </Legend>
        </Card>

        <Card>
          <Summary
            title={
              <TooltipIcon content={Tooltip.Dashboard.fourteenDay}>
                14d Lottery Jackpot
              </TooltipIcon>
            }
          >
            <Count symbol={UUSD} integer>
              {totalValueLocked}
            </Count>
          </Summary>
          <Legend title="Next draw in:">
            <Countdown end={fourteenDayEnd} />
          </Legend>
        </Card>

        <Card>
          <Summary
            title={
              <TooltipIcon content={Tooltip.Dashboard.twentyOneDay}>
                21d Lottery Jackpot
              </TooltipIcon>
            }
          >
            <Count symbol={UUSD} integer>
              {totalValueLocked}
            </Count>
          </Summary>

          <Legend title="Next draw in:">
            <Countdown end={twentyOneDayEnd} />
          </Legend>
        </Card>
      </Grid>
    </>
  )
}

export default DashboardHeader
