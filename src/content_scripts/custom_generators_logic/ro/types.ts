export type Sex = 'male' | 'female'

export type CnpOptions = {
  birthDate?: string
  age?: number
  minAge?: number
  maxAge?: number
  county?: string
}

export type CuiOptions = {
  isVatPayer?: boolean
}

export type RoPhoneOptions = {
  internationalFormat?: boolean // if true, returns +407xxxxxxxx format instead of 07xxxxxxxx
}
