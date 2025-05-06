export type ActionType =
  | 'input'
  | 'inputShadow'
  | 'simpleClick'
  | 'dispatchedClick'
  | 'checkCheckbox'
  | 'multiStep'

export type DataGeneratorType = 'static' | 'function'

export type StepType = {
  selector: string
  type: ActionType
  index?: number
  timeout?: number
  data?: string | number
  dataType?: DataGeneratorType
  dataGenerator?: string
}

export type SelectorType = {
  selector: string
  type: ActionType
  index?: number
  timeout?: number
  data?: string | number
  dataType?: DataGeneratorType
  dataGenerator?: string
  steps?: StepType[]
}

export type SiteDataType = Record<string, Record<string, SelectorType>>

export type ActionFunctions = {
  inputFiller: (element: HTMLElement, data: string | number) => void
  inputFillerShadow: (element: HTMLElement, data: string | number) => void
  simpleClick: (element: HTMLElement) => void
  dispatchedClick: (element: HTMLElement) => void
  checkCheckbox: (element: HTMLInputElement) => void
}
