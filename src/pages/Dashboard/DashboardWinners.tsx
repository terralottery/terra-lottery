import { UUSD } from "../../constants"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import Table from "../../components/Table"
import Icon from "../../components/Icon"
import ExtLink from "../../components/ExtLink"
import { truncate } from "../../libs/text"
import { formatAsset } from "../../libs/parse"
import styles from "./DashboardWinners.module.scss"
import { useWallet } from "../../hooks"

const DashboardWinners = () => {
  const { address } = useWallet()
  const winners = [
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdamxyz1",
      date: 1619992800,
      lottery: "UST - 7 days Lottery",
      jackpot: "6583343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam8Ocv",
      date: 1619647200,
      lottery: "UST - 14 days Lottery",
      jackpot: "15123343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1619388000,
      lottery: "UST - 7 days Lottery",
      jackpot: "5967343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdamfDe2",
      date: 1618783200,
      lottery: "UST - 7 days Lottery",
      jackpot: "4232333000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdamla91",
      date: 1618437600,
      lottery: "UST - 14 days Lottery",
      jackpot: "13845343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1618351200,
      lottery: "UST - 21 days Lottery",
      jackpot: "28496343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam1dsc",
      date: 1618178400,
      lottery: "UST - 7 days Lottery",
      jackpot: "6275943000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1617573600,
      lottery: "UST - 7 days Lottery",
      jackpot: "4256343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1617228000,
      lottery: "UST - 14 days Lottery",
      jackpot: "9617343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdamid03",
      date: 1616968800,
      lottery: "UST - 7 days Lottery",
      jackpot: "3714343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1616540400,
      lottery: "UST - 21 days Lottery",
      jackpot: "19835343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1616367600,
      lottery: "UST - 7 days Lottery",
      jackpot: "1153343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1615762800,
      lottery: "UST - 7 days Lottery",
      jackpot: "186343000",
    },
  ]

  return (
    <Grid>
      <Card>
        <Summary title="Recent Winners" />
        <Table
          columns={[
            {
              key: "address",
              title: "Wallet Address",
              render: (value) => {
                const link = `https://finder.terra.money/columbus-4/account/${value}`
                const classes =
                  value.toLowerCase() === address.toLowerCase()
                    ? `${styles.link} ${styles.active}`
                    : styles.link
                return (
                  <ExtLink href={link} className={classes}>
                    {truncate(value)}
                    <Icon name="launch" />
                  </ExtLink>
                )
              },
            },
            {
              key: "date",
              title: "Draw Date",
              render: (value) => {
                const date = new Date(value * 1000)
                return (
                  <>{`${String(date.getDate()).padStart(2, "0")}/${String(
                    date.getMonth() + 1
                  ).padStart(2, "0")}/${date.getFullYear()}`}</>
                )
              },
            },
            { key: "lottery", title: "Lottery" },
            {
              key: "jackpot",
              title: "Prize",
              render: (value) => formatAsset(value, UUSD, { integer: true }),
              align: "right",
            },
          ]}
          dataSource={winners}
        />
      </Card>
    </Grid>
  )
}

export default DashboardWinners
