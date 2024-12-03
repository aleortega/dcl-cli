import type { Dependencies, Flows, Workflow } from './../types'

import { readdir } from 'fs/promises'
import { join } from 'path'

export async function importAllFlows(deps: Dependencies): Promise<Flows> {
  const flowsDir = __dirname
  const files = await readdir(flowsDir)

  const modules: Flows = {} as any

  for (const file of files) {
    if (file.endsWith('.js') && file !== 'index.js') {
      const flowModule = await import(join(flowsDir, file))

      const module: Workflow<Workflow.Name> = (await flowModule.default(deps)) as Workflow<Workflow.Name>
      modules[module.name] = module.run
    }
  }

  return modules
}
