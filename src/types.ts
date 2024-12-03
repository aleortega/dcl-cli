import { IConfigComponent, IFetchComponent, ILoggerComponent } from '@well-known-components/interfaces'
import { CatalystClient } from 'dcl-catalyst-client'

export type Dependencies = Context & Components

export type Context = {
  env: IConfigComponent
  logger: ILoggerComponent
}

export type Components = {
  catalystClient: CatalystClient
  fetcher: IFetchComponent
}

export type Question = {
  message: string
  hint?: string
}

export type OptionsQuestion = Question & {
  options: {
    title: string
    value: any
    description?: string
    disabled?: boolean
  }[]
}

export interface Workflow<T extends Workflow.Name> {
  run(): Promise<void>
  name: T
}

export namespace Workflow {
  export enum Name {
    ANALYZE_WEARABLES = 'analyze-wearables',
    GET_CATALYST_SERVERS = 'get-catalyst-servers',
    ANALYZE_REALM_PROVIDER_SELECTION = 'analyze-realm-provider-selection',
    TEST_CORS = 'test-cors'
  }
}

export type Command = () => Promise<void>

export type Flows = Record<Workflow.Name, Command>
