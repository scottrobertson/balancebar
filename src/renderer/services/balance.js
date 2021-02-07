const { DataAPIClient } = require("truelayer-client");

export function noBalanceAccount(credential) {
  return {
    bank: {
      name: credential.provider.display_name,
      logo: credential.provider.icon_url,
    },
    name: "Unable to fetch accounts",
    balance: "We have not been able to fetch accounts for this bank at this time. Either try again, or reconnect.",
    hasError: true,
  };
}

export async function getBalance(type, credential, accessToken, object) {
  console.log(`Fetching balance for ${object.account_id}`);

  let balance;

  try {
    if (type === "account") {
      balance = await DataAPIClient.getBalance(accessToken, object.account_id);
    } else if (type === "card") {
      balance = await DataAPIClient.getCardBalance(accessToken, object.account_id);
    }

    balance = balance.results[0];

    const useBalance = type === "card" ? balance.current : balance.available;

    balance = new Intl.NumberFormat("gb-EN", { style: "currency", currency: balance.currency }).format(useBalance);
  } catch (e) {
    console.log(`Account balance fetch failure: ${object.account_id}`);
    balance = `Unable to get balance: ${e.error}`;
  }

  return {
    bank: {
      name: credential.provider.display_name,
      icon: credential.provider.logo_uri.replace("/logo/", "/icon/"),
      logo: credential.provider.logo_uri,
    },
    name: object.display_name,
    balance: balance,
  };
}
