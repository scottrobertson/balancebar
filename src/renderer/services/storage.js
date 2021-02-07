const keytar = require("keytar");
const KEYCHAIN_NAMESPACE = "balance-menubar";

export async function storeRefreshToken(credentials) {
  return await keytar.setPassword(KEYCHAIN_NAMESPACE, `credentials_${credentials.credentials_id}_refresh_token`, credentials.refreshToken);
}

export async function getRefreshToken(credentials) {
  return await keytar.getPassword(KEYCHAIN_NAMESPACE, `credentials_${credentials.credentials_id}_refresh_token`);
}

export async function storeTruelayerSecret(secret) {
  return await keytar.setPassword(KEYCHAIN_NAMESPACE, "truelayer-client-secret", secret);
}

export async function deleteTruelayerSecret() {
  return await keytar.deletePassword(KEYCHAIN_NAMESPACE, "truelayer-client-secret");
}

export async function getTruelayerSecret() {
  return await keytar.getPassword(KEYCHAIN_NAMESPACE, "truelayer-client-secret");
}
