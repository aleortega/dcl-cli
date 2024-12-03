import { Entity, EthAddress, Profile, Rarity, Wearable } from '@dcl/schemas'

import { askForTextInput } from '../asker'
import { Dependencies, Workflow } from '../types'

export async function hookEquippedWearablesRarityFlow(
  deps: Dependencies
): Promise<Workflow<Workflow.Name.ANALYZE_WEARABLES>> {
  const { catalystClient, logger } = deps
  const log = logger.getLogger('')
  const contentClient = await catalystClient.getContentClient()

  async function getWearablesData(wearableUrns: string[]): Promise<{ rarity: Rarity; urn: string; name: string }[]> {
    const wearables: Entity[] = await contentClient.fetchEntitiesByPointers(wearableUrns)
    const parsedWearables = wearables.map((wearable) => ({
      rarity: wearable.metadata.rarity as Rarity,
      urn: wearable.id,
      name: wearable.metadata.name
    }))
    return parsedWearables
  }

  async function run() {
    const userAddress: string = await askForTextInput({
      message: 'Enter the user address',
      hint: '(wallet)'
    })

    if (!EthAddress.validate(userAddress)) {
      throw new Error('Wallet address is invalid')
    }

    const profile: Entity = (await contentClient.fetchEntitiesByPointers([userAddress]))[0]

    if (!profile) {
      throw new Error('Profile not found')
    }

    const parsedUserWearables = profile.metadata.avatars[0].avatar.wearables.map((wearable: string) =>
      wearable.split(':').slice(0, -1).join(':')
    )
    const wearables = await getWearablesData(parsedUserWearables)
    log.info(
      `Wearables >> ${wearables.map((wearable) => `\n- (${wearable.rarity}) - ${wearable.name} - ${wearable.urn}`)}`
    )
  }

  return { run, name: Workflow.Name.ANALYZE_WEARABLES }
}

export default hookEquippedWearablesRarityFlow
