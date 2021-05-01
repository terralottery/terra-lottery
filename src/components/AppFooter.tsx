import discord from "./Community/discord.png"
import twitter from "./Community/twitter.png"
import github from "./Community/github.png"

import Container from "./Container"
import ExtLink from "./ExtLink"
import Icon from "./Icon"
import styles from "./AppFooter.module.scss"

interface Props {
  network?: string
}

const AppFooter = ({ network }: Props) => {
  const community = [
    {
      href: `https://github.terra-lottery.com`,
      src: github,
      alt: "Github",
    },
    {
      href: "https://twitter.terra-lottery.com",
      src: twitter,
      alt: "Twitter",
    },
    {
      href: "https://discord.terra-lottery.com",
      src: discord,
      alt: "Discord",
    },
  ]

  return (
    <footer className={styles.footer}>
      <Container className={styles.container}>
        {network && (
          <section className={styles.network}>
            <Icon name="wifi_tethering" size={20} />
            {network}
          </section>
        )}

        {community && (
          <section className={styles.community}>
            {community.map(
              ({ href, src, alt }) =>
                href && (
                  <ExtLink href={href} className={styles.link} key={alt}>
                    <img src={src} alt={alt} width={20} height={20} />
                  </ExtLink>
                )
            )}
          </section>
        )}
      </Container>
    </footer>
  )
}

export default AppFooter
