import { FC } from "react"
import classNames from "classnames/bind"
import { insertIf } from "../libs/utils"
import { percent } from "../libs/num"
import getLpName from "../libs/getLpName"
import Card from "./Card"
import Count from "./Count"
import Token from "./Token"
import styles from "./PoolItemCard.module.scss"
import LinkButton from "./LinkButton"
import Legend from "./Legend"
import { Countdown } from "./Countdown"
import { UUSD } from "../constants"
import { DlFooter } from "./Dl"

const cx = classNames.bind(styles)

export interface Props {
  symbol: string
  name?: string

  apy: number
  nextDraw: Date
  jackpot?: string
  tickets?: string
  to: string
}

const PoolItemCard: FC<Props> = ({ symbol, name, to, ...item }) => {
  const { apy, children, nextDraw, jackpot, tickets } = item
  const participating = Number(tickets) > 0
  const badges = [
    ...insertIf(participating, { label: "Participating", color: "blue" }),
  ]

  const stats = []
  if (participating && tickets) {
    stats.push({
      title: "Your Tickets",
      content: (
        <Count symbol="Tickets" integer>
          {tickets}
        </Count>
      ),
    })
  }
  stats.push({
    title: "APY",
    content: <Count format={percent}>{String(apy)}</Count>,
  })

  const link = {
    to: to,
    children: "Get Tickets",
  }
  return (
    <Card badges={badges} key={name}>
      <article className={styles.component}>
        <div className={styles.main}>
          <Token symbol={symbol} />

          <header className={cx(styles.header, { to })}>
            <h1 className={styles.heading}>{name ?? getLpName(symbol)}</h1>
            <h2 className={styles.subheading}>
              Jackpot:{" "}
              <Count symbol={UUSD} integer>
                {jackpot}
              </Count>
            </h2>

            <Legend title="Next draw in:">
              <Countdown end={nextDraw} />
            </Legend>
          </header>
          <DlFooter
            list={stats}
            className={styles.stats}
            ddClassName={styles.dd}
          />
        </div>
        {children}
        <LinkButton {...link} />
      </article>
    </Card>
  )
}

export default PoolItemCard
