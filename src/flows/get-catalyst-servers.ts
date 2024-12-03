import { Dependencies, Workflow } from '../types'
import RequestManager, { ContractFactory, HTTPProvider, bytesToHex } from 'eth-connect'
import { catalystAbi, CatalystByIdResult, l1Contracts, getCatalystServersFromDAO } from '@dcl/catalyst-contracts'

export async function hookGetCatalystServersFlow(
  deps: Dependencies
): Promise<Workflow<Workflow.Name.GET_CATALYST_SERVERS>> {
  const { fetcher, logger } = deps
  const log = logger.getLogger('')

  const provider = new HTTPProvider('https://rpc.decentraland.org/mainnet?project:catalyst-client-build', {
    fetch: fetcher.fetch
  })
  const requestManager = new RequestManager(provider)
  const factory = new ContractFactory(requestManager, catalystAbi)
  const contract = (await factory.at(l1Contracts.mainnet.catalyst)) as any

  const catalysts = await getCatalystServersFromDAO({
    async catalystCount(): Promise<number> {
      return contract.catalystCount()
    },
    async catalystIds(i: number): Promise<string> {
      return contract.catalystIds(i)
    },
    async catalystById(catalystId: string): Promise<CatalystByIdResult> {
      const [id, owner, domain] = await contract.catalystById(catalystId)
      return { id: '0x' + bytesToHex(id), owner, domain }
    }
  })

  async function run() {
    log.info(
      `Catalysts >> ${catalysts.map((catalyst) => `\n- ${catalyst.id} - ${catalyst.address} - ${catalyst.owner}`)}`
    )
  }

  return { run, name: Workflow.Name.GET_CATALYST_SERVERS }
}

export default hookGetCatalystServersFlow
