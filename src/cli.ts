import type { ILoggerComponent } from '@well-known-components/interfaces'

import { Dependencies, Flows, Workflow } from './types'
import { importAllFlows } from './flows'
import { askOptions } from './asker'

export async function initializeCli(deps: Dependencies): Promise<void> {
  const { logger } = deps
  const log: ILoggerComponent.ILogger = logger?.getLogger('cli')
  const allFlows: Flows = await getAllFlows()

  async function getAllFlows(): Promise<Flows> {
    const allFlows: Flows = await importAllFlows(deps)
    const allFlowsString = Object.keys(allFlows).join('\n\t')
    log.debug(`Flows registered:\n ${allFlowsString}`)

    return allFlows
  }

  async function promptFlowsAndExecute(): Promise<void> {
    const nameOfFlowToExecute: Workflow.Name = await askOptions({
      message: 'What do you want me to do?',
      options: [
        { title: 'Analyze user wearables', value: Workflow.Name.ANALYZE_WEARABLES },
        { title: 'Get all Catalyst servers', value: Workflow.Name.GET_CATALYST_SERVERS },
        { title: 'Analyze Catalyst selection', value: Workflow.Name.ANALYZE_REALM_PROVIDER_SELECTION },
        { title: 'Test cors', value: Workflow.Name.TEST_CORS }
      ]
    })

    const flowToExecute = allFlows[nameOfFlowToExecute]

    if (!flowToExecute) {
      const commandWasInserted = !!nameOfFlowToExecute
      commandWasInserted ? log.error(`Command not found: ${nameOfFlowToExecute}`) : {}
    } else {
      await flowToExecute().catch((error: any) => {
        log.info('Uh oh! Something went wrong...')
        log.info(`${error?.message || 'Unexpected error or invalid action, please dismiss.'}`)
      })
    }
  }

  let shouldContinue = true
  while (shouldContinue) {
    if (!shouldContinue) {
      log?.info('Exiting...')
      break
    }

    await promptFlowsAndExecute()

    shouldContinue = await askOptions({
      message: "What's next?",
      options: [
        { title: 'Continue', value: true },
        { title: 'Exit', value: false }
      ]
    })
  }
}
