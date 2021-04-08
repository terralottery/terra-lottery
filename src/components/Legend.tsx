import { FC, ReactNode } from "react"
import styles from "./Legend.module.scss"

interface Props {
  title: ReactNode
  footer?: string
}

const Legend: FC<Props> = ({ title, children }) => (
  <article className={styles.article}>
    <div className={styles.wrapper}>
      <p className={styles.title}>{title}</p>
      <p className={styles.content}>{children}</p>
    </div>
  </article>
)

export default Legend
