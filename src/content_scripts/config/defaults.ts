export interface DefaultSettings {
  [key: string]: string | number
  userPrefix: string
  emailDomain: string
  defaultLoremLength: number
  defaultPatternText: string
  defaultPatternLength: number
  defaultMultiplierText: string
  defaultMultiplierLines: number
  defaultMultiplierLength: number
  defaultCounterLength: number
}

export const defaultSettings: DefaultSettings = {
  // Form Filler defaults
  userPrefix: 'test',
  emailDomain: 'gmail.com',

  // Text Generator defaults
  defaultLoremLength: 100,
  defaultPatternText: 'test',
  defaultPatternLength: 1000,
  defaultMultiplierText: 'sample text',
  defaultMultiplierLines: 3,
  defaultMultiplierLength: 50,
  defaultCounterLength: 100
}
