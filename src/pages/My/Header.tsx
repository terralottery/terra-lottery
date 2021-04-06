import { ReactNode } from "react"
import styles from "./Header.module.scss"

const Header = ({ total }: { total: ReactNode }) => (
  <header className={styles.flex}>{total}</header>
)

export default Header
