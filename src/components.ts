import { createFetchComponent } from '@well-known-components/fetch-component'
import { IFetchComponent } from '@well-known-components/interfaces'

import { CatalystClient, createCatalystClient } from 'dcl-catalyst-client'

import { Components, Context } from './types'

export async function initializeComponents(context: Context): Promise<Components> {
  const { env, logger } = context
  const fetch: IFetchComponent = createFetchComponent()

  const catalystUrl: string = await env.requireString('CATALYST_URL')
  const catalystClient: CatalystClient = createCatalystClient({ fetcher: fetch, url: catalystUrl })

  return {
    catalystClient,
    fetcher: fetch
  }
}
