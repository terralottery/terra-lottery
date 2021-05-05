import Token from "./Token"
import styles from "./StakeDetailsHeader.module.scss"

interface Props {
  center?: boolean
  children: string
  name?: string
}

const StakeDetailsHeader = ({ center, name, children: symbol }: Props) => (
  <div className={center ? styles.center : styles.wrapper}>
    <Token symbol={symbol} bg="darkblue" />
    <h1 className={styles.title}>{name}</h1>
  </div>
)

export default StakeDetailsHeader
