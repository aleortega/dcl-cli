import prompts from 'prompts'
import { OptionsQuestion, Question } from './types'

export async function askOptions(question: OptionsQuestion) {
  const answer = await prompts({
    type: 'select',
    name: 'response',
    message: question.message,
    choices: question.options
  })

  return answer.response
}

export async function askForTextInput(question: Question) {
  const answer = await prompts({
    type: 'text',
    name: 'response',
    message: question.message,
    hint: question?.hint
  })

  return answer.response
}
