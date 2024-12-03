import { Dependencies, Workflow } from '../types'

export async function hookAnalyzeRealmProviderSelectionFlow(
  deps: Dependencies
): Promise<Workflow<Workflow.Name.ANALYZE_REALM_PROVIDER_SELECTION>> {
  const { fetcher, logger } = deps
  const log = logger.getLogger('')

  async function run() {
    const amountOfFetches = 20
    const realmProviderUrl = 'https://realm-provider-ea.decentraland.org/main/about'

    for (let i = 0; i < amountOfFetches; i++) {
      const response = await fetcher.fetch(realmProviderUrl + `?no-cache=${i}`)
      const json = await response.json()
      log.info(`Fetch ${i + 1}/${amountOfFetches} >> ${json}`)
    }
  }

  return { run, name: Workflow.Name.ANALYZE_REALM_PROVIDER_SELECTION }
}

export default hookAnalyzeRealmProviderSelectionFlow
