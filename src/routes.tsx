import { Switch, Route, RouteProps, Redirect } from "react-router-dom"
import { Dictionary } from "ramda"

import Dashboard from "./pages/Dashboard"
import Info from "./pages/Info/Info"
import Auth from "./pages/Auth"
import My from "./pages/My/My"
import Send from "./pages/Send"
import Pools from "./pages/Pools"
import Data from "./tools/Data"
import Tool from "./tools/Tool"

export enum MenuKey {
  DASHBOARD = "Dashboard",
  INFO = "How It Works",
  AUTH = "Auth",
  MY = "My Account",
  SEND = "Send",
  POOLS = "Prize Pools",
}

export const omit = [MenuKey.DASHBOARD, MenuKey.AUTH, MenuKey.SEND]

export const menu: Dictionary<RouteProps> = {
  // Not included in navigation bar
  [MenuKey.DASHBOARD]: { path: "/", exact: true, component: Dashboard },
  [MenuKey.AUTH]: { path: "/auth", component: Auth },
  [MenuKey.SEND]: { path: "/send", component: Send },

  // Menu
  [MenuKey.INFO]: { path: "/info", component: Info },
  [MenuKey.MY]: { path: "/my", component: My },
  [MenuKey.POOLS]: { path: "/pools", component: Pools },

  // For developers
  data: { path: "/data", component: Data },
  tool: { path: "/tool", component: Tool },
}

export const getPath = (key: MenuKey) => menu[key].path as string

export default (routes: Dictionary<RouteProps> = menu, path: string = "") => (
  <Switch>
    {Object.entries(routes).map(([key, route]) => (
      <Route {...route} path={path + route.path} key={key} />
    ))}

    <Redirect to="/" />
  </Switch>
)
