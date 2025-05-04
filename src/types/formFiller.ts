export type ActionType =
  | 'input'
  | 'inputShadow'
  | 'simpleClick'
  | 'dispatchedClick'
  | 'checkCheckbox'
  | 'multiStep'

// Global type definitions for window objects
declare global {
  interface Window {
    // Basic data generators
    generateRandomName: () => string
    generateRandomLastName: () => string
    generateRandomEmail: () => string
    generatePolishMobile: (prefix?: number) => string
    generateMortagePeriod: (min?: number, max?: number) => string
    generateIncomeAmount: (min?: number, max?: number) => string
    generateHouseholdExpenses: (min?: number, max?: number) => string
    generateYearOfBirth: (min?: number, max?: number) => string

    // Document generators - PL
    generatePeselMale: (minAge?: number, maxAge?: number) => string
    generatePeselFemale: (minAge?: number, maxAge?: number) => string
    generatePesel: (minAge?: number, maxAge?: number) => string
    generateNip: () => string
    generateRegon: () => string
    generateIban: () => string
    generateIdNumber: () => string
    generatePassportNumber: () => string

    // Document generators - RO
    generateCnpMale: (minAge?: number, maxAge?: number) => string
    generateCnpFemale: (minAge?: number, maxAge?: number) => string
    generateCui: (isVatPayer?: boolean) => string
    generateRoPhone: (internationalFormat?: boolean) => string

    // Generic generators
    generateRandomDate: (minAge?: number, maxAge?: number) => string
  }
}
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
