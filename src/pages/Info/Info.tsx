import Page from "../../components/Page"
import Card from "../../components/Card"
import styles from "./Info.module.scss"
import ExtLink from "../../components/ExtLink"
import { useMemo } from "react"
import { currentAPY } from "../Dashboard/DashboardHeader"
import { useInterest } from "../../graphql/queries/interest"
import { useConstants } from "../../contexts/contants"
import big from "big.js"
import { percent } from "../../libs/num"
import Count from "../../components/Count"
import { Link } from "react-router-dom"
import Icon from "../../components/Icon"

const Data = () => {
  const { blocksPerYear } = useConstants()
  const {
    data: { marketStatus },
  } = useInterest()
  const apy = useMemo(() => currentAPY(marketStatus, blocksPerYear), [
    blocksPerYear,
    marketStatus,
  ])
  const anchorApy = big(apy).toFixed()

  return (
    <Page>
      <Card className={styles.wrapper}>
        <h1 className={styles.main}>
          What is <em>Terra Lottery</em>?
        </h1>
        <p>
          <em>Terra Lottery</em> is a prize game on the Terra blockchain. It
          uses the concept of a "No Loss Lottery" and was built to utilize{" "}
          <ExtLink
            className={styles.link}
            href="https://app.anchorprotocol.com/earn"
          >
            Anchor Protocol's <Icon name="launch" />
          </ExtLink>{" "}
          APY for UST - a stable coin on the Terra Blockchain.
        </p>
        <p>
          <em>Terra Lottery</em> combines the mechanics of a classical Lottery
          with the stablecoin yield mechanics of a decentralized finance
          product.
        </p>
        <h2 className={styles.sub}>What is a "No Loss Lottery"</h2>
        <p>
          A <em>No Loss Lottery</em> is a type of lottery, where owning tickets
          generate yield over time and also enable the holder to participate at
          the lottery.
        </p>
        <h2 className={styles.sub}>
          How does <em>Terra Lottery</em> work?
        </h2>
        <p>
          Thanks to{" "}
          <ExtLink
            className={styles.link}
            href="https://app.anchorprotocol.com"
          >
            Anchor Protocol <Icon name="launch" />
          </ExtLink>{" "}
          you can earn UST by lending it via the protocols Application. As a
          reward for lending UST you generate yield (currently{" "}
          <Count format={(value) => percent(value, 2)}>{anchorApy}</Count>) in
          form of UST.
        </p>
        <p>
          <em>Terra Lottery</em> offers three{" "}
          <Link to="/pools" className={styles.link}>
            Prize Pools
          </Link>
          . Those Prize Pools collect yield over a specific timeframe (7 Days,
          14 Days and 21 Days). Users are able to join those Prize Pools by
          "purchasing" tickets for the individual pool. The price of 1 Ticket
          equals 1 UST, to "buy" 100 Tickets for a Prize Pool you have to stake
          100 UST via the <em>Terra Lottery</em> interface. Those 100 UST will
          then be lend by <em>Terra Lottery</em> via the{" "}
          <ExtLink
            className={styles.link}
            href="https://app.anchorprotocol.com/earn"
          >
            Anchor Protocol <Icon name="launch" />
          </ExtLink>{" "}
          generating yield.
        </p>
        <p>
          While a user has tickets for one or more prize pools, he earns
          interest on those tickets. But other than lending the UST directly via
          Anchor Protocol, the user is only eligable for half (50%) the
          generated yield. The other half of the yield goes into the prize pool
          the user "bought" the tickets for, generating the jackpot of the price
          pool.
        </p>
        <p>
          At the end of a prize pool period, a winner will be drawn, who can
          claim the yield the pool generated over it's yield generating period
          (7, 14 or 21 Days). Right after a winner was drawn, the pool continues
          to generate yield and a new winner will be drawn after the yield
          generation period. The odds of winning the jackpot of a price pool are
          1 : [total amount of tickets] / [your tickets]. E.g.: If you own 50
          tickets of a prize pool with a total of 100 tickets, your odds are 1:2
          (50%) to win the jackpot.
        </p>
        <p>
          The amount of tickets (UST) inside the pool at the moment of the draw
          defines the odds of winning.
        </p>
        <h2 className={styles.sub}>Whale prevention</h2>
        <p>
          Terra is a blockchain "for the people". To prevent large UST holders
          to join a prize pool, with a large amount of UST, right before a draw
          and exiting it directly after it, tickets lock your UST for the
          duration of the price pool. So if you join the 7 Day Prize Pool on a
          Tuesday at 3pm, you'll have to wait until the next Tuesday 3pm before
          you can withdraw your UST (converting your tickets back into UST).
          This ensures that everyone who participates in a price pool period
          provides his share of yield for it (or the next period).
        </p>
        <p>
          You can keep your tickets in the price pool after the lock period.
          Tickets will never be removed or added automatically. Your tickets
          will participate in the draws of a price pool until you withdraw them.
        </p>
        <h2 className={styles.sub}>Dev Fund and Treasury</h2>
        <p>
          To ensure the continuously improvement of <em>Terra Lottery</em> 1% of
          every prize pool jackpot goes to a wallet that forms the Dev Fund and
          Treasury of <em>Terra Lottery</em>. Those funds will be used to
          enhance the platform and generate a salary for its creators.
        </p>
        <h2 className={styles.sub}>MIR, ANC, LUNA and others</h2>
        <p>
          If <em>Terra Lottery</em> succeeds on its cause to be a valuable part
          of the Terra Ecosystem, other Prize Pools will be added over time. The{" "}
          <ExtLink className={styles.link} href="https://terra.mirror.finance/">
            Mirror Protocol <Icon name="launch" />
          </ExtLink>{" "}
          offers a stable APY for staking MIR and could be utilized as well. ANC
          the governance token of the{" "}
          <ExtLink
            className={styles.link}
            href="https://app.anchorprotocol.com/earn"
          >
            Anchor Protocol <Icon name="launch" />
          </ExtLink>{" "}
          offers an APY as well. Also LUNA could be considered a token for a
          prize pool, generating a LUNA jackpot.
        </p>
      </Card>
    </Page>
  )
}

export default Data
