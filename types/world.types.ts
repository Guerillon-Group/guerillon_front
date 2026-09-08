export interface WorldCountry {
  id: number
  name: string
  iso2: string
  iso3?: string
  phone_code?: string
  region?: string
  subregion?: string
  currency?: string
  currency_name?: string
  currency_symbol?: string
}

export interface WorldState {
  id: number
  name: string
  country_id: number
  country_code?: string
  state_code?: string
}

export interface WorldCity {
  id: number
  name: string
  state_id?: number
  country_id?: number
  latitude?: string | number
  longitude?: string | number
}

export interface WorldCurrency {
  id: number
  name: string
  code: string
  symbol: string
  symbol_native?: string
}
