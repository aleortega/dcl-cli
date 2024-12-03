import { Dependencies, Workflow } from './types'

export async function createCommander(deps: Dependencies) {
  async function getFlowsMap(): Promise<Map<Workflow.Name, Workflow<Workflow.Name>>> {
    const flows = new Map<Workflow.Name, Workflow<Workflow.Name>>()

    // import all flows
    const { hookEquippedWearablesRarityFlow } = await import('./flows/equipped-wearables-rarity')

    return undefined as any
  }
}
