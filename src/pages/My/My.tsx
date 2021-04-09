import { MenuKey } from "../../routes"
import { useWallet } from "../../hooks"
import Page from "../../components/Page"
import Grid from "../../components/Grid"
import Button from "../../components/Button"
import ConnectionRequired from "../../containers/ConnectionRequired"
import useMy from "./useMy"
import Header from "./Header"
import TotalValue from "./TotalValue"
import Pools from "./Pools"

const My = () => {
  const { address, disconnect } = useWallet()
  const { pools, total } = useMy()

  const header = {
    total: <TotalValue {...total} />,
  }

  const contents = [
    {
      key: "pools",
      component: <Pools {...pools} />,
    },
  ]

  return (
    <Page title={MenuKey.MY}>
      {!address ? (
        <ConnectionRequired />
      ) : (
        <>
          <Grid>
            <Header {...header} />
          </Grid>

          {contents.map(({ component, key }) => (
            <Grid key={key}>{component}</Grid>
          ))}
          {disconnect && (
            <Button
              className="mobile"
              onClick={disconnect}
              color="secondary"
              outline
              block
              submit
            >
              Disconnect
            </Button>
          )}
        </>
      )}
    </Page>
  )
}

export default My
