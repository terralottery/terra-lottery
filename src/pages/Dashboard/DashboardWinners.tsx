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

const DashboardWinners = () => {
  const winners = [
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1617896079,
      lottery: "7d Lottery",
      jackpot: "15123343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1617896079,
      lottery: "7d Lottery",
      jackpot: "15123343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1617896079,
      lottery: "7d Lottery",
      jackpot: "15123343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1617896079,
      lottery: "7d Lottery",
      jackpot: "15123343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1617896079,
      lottery: "7d Lottery",
      jackpot: "15123343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1617896079,
      lottery: "7d Lottery",
      jackpot: "15123343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1617896079,
      lottery: "7d Lottery",
      jackpot: "15123343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1617896079,
      lottery: "7d Lottery",
      jackpot: "15123343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1617896079,
      lottery: "7d Lottery",
      jackpot: "15123343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1617896079,
      lottery: "7d Lottery",
      jackpot: "15123343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1617896079,
      lottery: "7d Lottery",
      jackpot: "15123343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1617896079,
      lottery: "7d Lottery",
      jackpot: "15123343000",
    },
    {
      address: "terra1u48kjlf2n0s77v0yhkmle58rdqgrqmdam0cv56",
      date: 1617896079,
      lottery: "7d Lottery",
      jackpot: "15123343000",
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
                return (
                  <ExtLink href={link} className={styles.link}>
                    <Icon name="launch" />
                    {truncate(value)}
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
