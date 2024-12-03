import { askForTextInput } from '../asker'
import { Dependencies, Workflow } from '../types'

export async function hookTestCorsFlow(deps: Dependencies): Promise<Workflow<Workflow.Name.TEST_CORS>> {
  const { fetcher, logger } = deps
  const log = logger.getLogger('')

  async function run() {
    const urlsToTest: string[] = []

    let input: string = ''

    while (input !== 'done') {
      input = await askForTextInput({
        message: 'Enter a url to test',
        hint: 'Enter "done" to finish'
      })

      if (input !== 'done') {
        urlsToTest.push(input)
      }
    }

    const originToUse: string = await askForTextInput({
      message: 'Enter an origin to simulate',
      hint: 'e.g. https://test-origin.com'
    })

    for (const url of urlsToTest) {
      try {
        const response = await fetcher.fetch(url, {
          method: 'OPTIONS',
          headers: {
            Origin: originToUse,
            'Access-Control-Request-Method': 'GET'
          }
        })

        const corsHeader = response.headers.get('access-control-allow-origin')
        if (corsHeader === originToUse || corsHeader === '*') {
          log.info(`[PASS] CORS is set correctly for ${url}`)
        } else {
          log.info(`[FAIL] CORS header is missing or incorrect for ${url}`)
        }
      } catch (error: any) {
        log.info(`[ERROR] Failed to test ${url}: ${error?.message || 'unknown'}`)
      }
    }
  }

  return { run, name: Workflow.Name.TEST_CORS }
}

export default hookTestCorsFlow
