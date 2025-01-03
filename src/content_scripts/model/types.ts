export type ActionType =
  | 'input'
  | 'inputShadow'
  | 'simpleClick'
  | 'dispatchedClick'
  | 'checkCheckbox'
  | 'multiStep'

export type SelectorType = {
  selector: string
  type: ActionType
  data?: string | number
  index?: number
  timeout?: number
  steps?: StepType[]
  [key: string]: any
}

export type StepType = {
  selector: string
  type: ActionType
  data?: string | number
  index?: number
}

export type SiteDataType = {
  [key: string]: {
    [key: string]: SelectorType
  }
}

export type ActionFunctions = {
  inputFiller: (element: HTMLElement, data: string | number) => void
  inputFillerShadow: (element: HTMLElement, data: string | number) => void
  simpleClick: (element: HTMLElement) => void
  dispatchedClick: (element: HTMLElement) => void
  checkCheckbox: (element: HTMLInputElement) => void
}
