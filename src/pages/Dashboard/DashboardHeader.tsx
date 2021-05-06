import { UUSD } from "../../constants"
import Tooltip from "../../lang/Tooltip.json"
import { percent } from "../../libs/num"
import { useRefetch } from "../../hooks"
import { PriceKey } from "../../hooks/contractKeys"
import { StatsNetwork } from "../../statistics/useDashboard"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import Count from "../../components/Count"
import { TooltipIcon } from "../../components/Tooltip"
import { Countdown, getNextDraw } from "../../components/Countdown"
import Legend from "../../components/Legend"
import { useMemo } from "react"
import { useInterest } from "../../graphql/queries/interest"
import type { Rate } from "@anchor-protocol/types"
import { moneyMarket } from "@anchor-protocol/types"
import big, { Big } from "big.js"
import { useConstants } from "../../contexts/contants"

interface Props extends Partial<Dashboard> {
  network: StatsNetwork
}

export function currentAPY(
  epochState: moneyMarket.overseer.EpochStateResponse | undefined,
  blocksPerYear: number
): Rate<Big> {
  return big(epochState?.deposit_rate ?? "0").mul(blocksPerYear) as Rate<Big>
}

const DashboardHeader = ({ network, ...props }: Props) => {
  const { blocksPerYear } = useConstants()
  const { latest24h } = props
  const jackpotSizeT7ust = latest24h?.feeVolume ?? "0"
  const jackpotSizeT14ust = latest24h?.mirVolume ?? "0"
  const jackpotSizeT21ust = latest24h?.volume ?? "0"
  const sevenDayEnd = getNextDraw("7d")
  const fourteenDayEnd = getNextDraw("14d")
  const twentyOneDayEnd = getNextDraw("21d")
  const {
    data: { marketStatus },
  } = useInterest()

  const apy = useMemo(() => currentAPY(marketStatus, blocksPerYear), [
    blocksPerYear,
    marketStatus,
  ])

  const ticketApy = Number(big(apy).toFixed()) / 2

  useRefetch([PriceKey.PAIR])

  return (
    <>
      <Grid>
        <Card>
          <Summary
            title={
              <TooltipIcon content={Tooltip.Dashboard.APY}>
                Current Tickets APY
              </TooltipIcon>
            }
          >
            <Count format={(value) => percent(value, 2)}>
              {String(ticketApy)}
            </Count>
          </Summary>
        </Card>

        <Card>
          <Summary
            title={
              <TooltipIcon content={Tooltip.Dashboard.sevenDay}>
                UST - 7d Lottery Jackpot
              </TooltipIcon>
            }
          >
            <Count symbol={UUSD} integer>
              {jackpotSizeT7ust}
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
                UST - 14d Lottery Jackpot
              </TooltipIcon>
            }
          >
            <Count symbol={UUSD} integer>
              {jackpotSizeT14ust}
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
                UST - 21d Lottery Jackpot
              </TooltipIcon>
            }
          >
            <Count symbol={UUSD} integer>
              {jackpotSizeT21ust}
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
