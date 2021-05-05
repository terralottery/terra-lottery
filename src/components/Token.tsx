import styles from "./Token.module.scss"

interface Props {
  symbol: string
  bg?: string
}

const ICON_SIZE = { width: 25, height: 25 }
const ICON_URL = "https://logos.terra-lottery.com"
export const getIcon = (symbol: string) => `${ICON_URL}/${symbol}.png`

const Token = ({ symbol, bg = "bg" }: Props) => (
  <section className={styles.images}>
    <div className={styles.outline}>
      <img {...ICON_SIZE} src={getIcon(symbol)} alt="" />
    </div>
  </section>
)

export default Token
