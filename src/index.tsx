import { StrictMode } from "react"
import { render } from "react-dom"
import * as Sentry from "@sentry/react"
import { Integrations } from "@sentry/tracing"
import "./index.scss"
import { DSN } from "./constants"
import ScrollToTop from "./layouts/ScrollToTop"
import Network from "./layouts/Network"
import Contract from "./layouts/Contract"
import App from "./layouts/App"
import { AppProviders } from "./pages/AppProviders"

process.env.NODE_ENV === "production" &&
  Sentry.init({
    dsn: DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  })

render(
  <StrictMode>
    <Network>
      <Contract>
        <AppProviders>
          <ScrollToTop />
          <App />
        </AppProviders>
      </Contract>
    </Network>
  </StrictMode>,
  document.getElementById("terralottery")
)
