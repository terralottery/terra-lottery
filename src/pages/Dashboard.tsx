import useDashboard, { StatsNetwork } from "../statistics/useDashboard"
import Page from "../components/Page"
import DashboardHeader from "./Dashboard/DashboardHeader"
import DashboardCharts from "./Dashboard/DashboardCharts"
import DashboardWinners from "./Dashboard/DashboardWinners"

const Dashboard = () => {
  const { dashboard, network } = useDashboard(StatsNetwork.TERRA)

  return (
    <Page>
      <DashboardHeader {...dashboard} network={network} />
      <DashboardCharts {...dashboard} />
      <DashboardWinners />
    </Page>
  )
}

export default Dashboard
