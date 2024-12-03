import { createDotEnvConfigComponent } from "@well-known-components/env-config-provider"
import { IConfigComponent, ILoggerComponent } from "@well-known-components/interfaces"
import { createLogComponent } from "@well-known-components/logger"
import { initializeComponents } from "./components"
import { Components } from "./types"
import { initializeCli } from "./cli"

async function run() {
    const env: IConfigComponent = await createDotEnvConfigComponent({ path: ['.env.default', '.env'] })
    const logger: ILoggerComponent = await createLogComponent({
        config: env
    })

    const log = logger.getLogger('main')

    log.debug('--- Initializing components ---')
    const components: Components = await initializeComponents({ env, logger })

    log.debug('--- Components initialized ---')
    log.debug('--- Starting ---')
    const allDependencies = { ...components, logger, env }
    await initializeCli(allDependencies)
}

run()