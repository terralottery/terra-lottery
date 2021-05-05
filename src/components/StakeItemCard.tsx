import { FC } from "react"
import classNames from "classnames/bind"
import { insertIf } from "../libs/utils"
import { percent } from "../libs/num"
import getLpName from "../libs/getLpName"
import Card from "./Card"
import Count from "./Count"
import Token from "./Token"
import styles from "./StakeItemCard.module.scss"

const cx = classNames.bind(styles)

export interface Props {
  lpToken: string
  symbol: string
  name?: string

  participating: boolean
  apy: number

  to?: string
}

const StakeItemCard: FC<Props> = ({ lpToken, symbol, name, to, ...item }) => {
  const { participating, apy, children } = item

  const badges = [
    ...insertIf(participating, { label: "Participating", color: "blue" }),
  ]

  const stats = [
    { title: "APY", content: <Count format={percent}>{String(apy)}</Count> },
  ].filter(({ content }) => content)

  return (
    <Card to={to} badges={badges} key={name}>
      <article className={styles.component}>
        <div className={styles.main}>
          <Token symbol={symbol} />

          <header className={cx(styles.header, { to })}>
            <h1 className={styles.heading}>{name ?? getLpName(symbol)}</h1>
          </header>
          <section className={styles.vertical}>
            {stats.map(({ title, content }, index) => (
              <article className={styles.item} key={index}>
                <h1 className={styles.title}>{title}</h1>
                <div className={styles.content}>{content}</div>
              </article>
            ))}
          </section>
        </div>

        {children}
      </article>
    </Card>
  )
}

export default StakeItemCard
