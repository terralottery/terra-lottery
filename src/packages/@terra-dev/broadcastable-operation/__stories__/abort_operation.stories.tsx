import {
  createBroadcastingOption,
  createOperationOptions,
  OperationBroadcaster,
  OperationDependency,
  useBroadcasting,
  useOperation,
} from "../index"
import { ActionButton } from "@terra-dev/neumorphism-ui/components/ActionButton"
import React, { ComponentType } from "react"
import { FloatingContainer } from "./fixtures/FloatingContainer"
import { Rate, uUST } from "@anchor-protocol/types"

const dependencies = {
  addressProvider: undefined,
  address: undefined,
  client: undefined,
  post: undefined,
  gasFee: 1000000 as uUST<number>,
  fixedGas: 250000 as uUST<number>,
  blocksPerYear: 4906443,
  gasAdjustment: 1.6 as Rate<number>,
}

export default {
  title: "core/broadcastable-operation",
  decorators: [
    (Story: ComponentType) => (
      <OperationBroadcaster dependency={dependencies}>
        <Story />
        <Container />
      </OperationBroadcaster>
    ),
  ],
}

// dummy fetch
function fetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<{ json: () => Promise<{ c: number }> }> {
  return new Promise((resolve) => {
    const a = /a=([0-9]+)/.exec(input.toString())
    const b = /b=([0-9]+)/.exec(input.toString())

    if (!a || !b) {
      throw new Error("Undefined query a or b")
    }

    const timeout = setTimeout(() => {
      resolve({
        json: () =>
          Promise.resolve({
            c: parseInt(a[1]) + parseInt(b[1]),
          }),
      })
    }, 1000 * 10)

    init?.signal?.addEventListener("abort", () => {
      console.log("fetch() is aborted!!!!")
      clearTimeout(timeout)
    })
  })
}

const operationOptions = createOperationOptions({
  pipe: ({ signal }: OperationDependency) => [
    ({ a, b }: { a: number; b: number }) =>
      fetch(`http://dummy?a=${a}&b=${b}`, { signal }).then((res) => res.json()),
    ({ c }: { c: number }) => c,
  ],
  renderBroadcast: (result) => {
    return <pre>{JSON.stringify(result, null, 2)}</pre>
  },
})

const broadcastingOptions = createBroadcastingOption({
  map: ({ id, rendering }) => <li key={id}>{rendering}</li>,
  displayTime: 5000,
})

function Container() {
  const renderings = useBroadcasting(broadcastingOptions)
  return <FloatingContainer>{renderings}</FloatingContainer>
}

/**
 * story
 *
 * 1. If result.status is 'in-progress' the result has `abort()` function
 * 2. `abort()` function is stop the operation immediately
 * 3. if the operator(fetch()) used the `signal: AbortSignal` the operator can be stop by the abort signal event immediately
 */
export const Abort_Operation = () => {
  const [operate, result] = useOperation(operationOptions, {})

  return (
    <div>
      <section style={{ marginBottom: 20 }}>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </section>

      <section>
        {result?.status === "in-progress" ? (
          <ActionButton style={{ width: 200 }} onClick={() => result.abort()}>
            Abort Operation
          </ActionButton>
        ) : (
          <ActionButton
            style={{ width: 200 }}
            onClick={() => operate({ a: 1, b: 2 })}
          >
            Operation
          </ActionButton>
        )}
      </section>
    </div>
  )
}
