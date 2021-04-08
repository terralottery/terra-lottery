import { RouteProps, useRouteMatch } from "react-router-dom"
import routes from "../routes"
import Claim from "./Pools/Claim"
import PoolsDetails from "./Pools/PoolsDetails"
import PoolsHome from "./Pools/PoolsHome"

export enum MenuKey {
  INDEX = "Prize Pools",
  CLAIMALL = "Claim all",
  CLAIMSYMBOL = "Claim",
  DETAILS = "Prize Pool Details",
}

export const menu: Record<MenuKey, RouteProps> = {
  [MenuKey.INDEX]: { path: "/", exact: true, component: PoolsHome },
  [MenuKey.CLAIMALL]: { path: "/claim", component: Claim },
  [MenuKey.CLAIMSYMBOL]: { path: "/:token/claim", component: Claim },
  [MenuKey.DETAILS]: { path: "/:token", component: PoolsDetails },
}

export enum Type {
  "STAKE" = "stake",
  "UNSTAKE" = "withdraw",
}

const Pools = () => {
  const { path } = useRouteMatch()
  return routes(menu, path)
}

export default Pools
