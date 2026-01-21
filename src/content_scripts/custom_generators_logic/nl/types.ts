export type Sex = 'male' | 'female'

export type BsnOptions = {
  birthDate?: string
  age?: number
  minAge?: number
  maxAge?: number
}

export type NlPhoneOptions = {
  internationalFormat?: boolean // if true, returns +316xxxxxxxx format instead of 06xxxxxxxx
  phoneType?: 'mobile' | 'landline' // mobile starts with 06, landline with area codes like 020, 010
}

export type NlIbanOptions = {
  bankCode?: string // 4-letter bank code, if not provided random from list
}

