import useDashboard, { StatsNetwork } from "../statistics/useDashboard"
import Page from "../components/Page"
import DashboardHeader from "./Dashboard/DashboardHeader"
import DashboardCharts from "./Dashboard/DashboardCharts"

const Dashboard = () => {
  const { dashboard, network } = useDashboard(StatsNetwork.TERRA)

  return (
    <Page>
      <DashboardHeader {...dashboard} network={network} />
      <DashboardCharts {...dashboard} />
    </Page>
  )
}

export default Dashboard
