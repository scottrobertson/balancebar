export interface ReturnedBank {
  name: string;
  icon: string;
  logo: string;
}

export interface ReturnedAccount {
  bank: ReturnedBank;
  name: string;
  error: string;
}

export interface TrueLayerCardOrAccount {
  account_id: string;
  display_name: string;
}

export interface Credential {
  credentials_id: string;
}

export interface TrueLayerAccessToken {
  access_token: string;
  refresh_token: string;
}

export interface TrueLayerCredentials {
  refreshToken: string;
  credentials: Credential;
}
