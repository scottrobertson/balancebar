import { DataAPIClient, AuthAPIClient } from "truelayer-client";
import { getTruelayerSecret, getRefreshToken } from "./secure-storage.js";

export async function refreshAllAccounts(truelayerClientId, credentials) {
  let allAccounts = [];

  if (credentials && credentials.length) {
    await Promise.all(
      credentials.map(async (credential) => {
        const accounts = await getAccountsForCredential(truelayerClientId, credential);
        allAccounts.push(...accounts);
      })
    );
  }

  return allAccounts;
}

async function getAccountObject(type, credential, accessToken, object) {
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

function noBalanceAccountObject(credential) {
  return {
    bank: {
      name: credential.provider.display_name,
      logo: credential.provider.icon_url,
    },
    name: "Unable to fetch accounts",
    error: "We have not been able to fetch accounts for this bank at this time. Either try again, or reconnect.",
  };
}

async function getAccountsForCredential(truelayerClientId, credential) {
  console.log(`Fetching accounts/cards for credential: ${credential.credentials_id}`);

  let accessToken;
  const accounts = [];

  const client = new AuthAPIClient({
    client_id: truelayerClientId,
    client_secret: await getTruelayerSecret(),
  });

  const refreshToken = await getRefreshToken(credential);

  try {
    const refreshedToken = await client.refreshAccessToken(refreshToken);
    accessToken = refreshedToken.access_token;
  } catch (e) {
    console.log(e.error);

    accounts.push({
      bank: {
        name: credential.provider.display_name,
        logo: credential.provider.icon_url,
      },
      name: "Cannot access account",
      error: "We have been unable to refresh the access tokens, please disconnect and try again..",
    });
  }

  if (accessToken) {
    const accountsAndCards = await getAccountsAndCards(accessToken, credential);
    accounts.push(...accountsAndCards);
  }

  return accounts;
}

async function getAccountsAndCards(accessToken, credential) {
  let [accounts, cards] = await Promise.all([getAccounts(accessToken, credential), getCards(accessToken, credential)]);

  return [...accounts, ...cards];
}

async function getCards(accessToken, credential) {
  const returnCards = [];
  let cards;

  if (credential.scopes.includes("cards")) {
    try {
      console.log(`Fetching cards for ${credential.credentials_id}`);
      cards = await DataAPIClient.getCards(accessToken);
    } catch (e) {
      console.log(`Unable to fetch cards ${credential.credentials_id}`);
      returnCards.push(noBalanceAccountObject(credential));
    }

    if (cards) {
      await Promise.all(
        cards.results.map(async (card) => {
          const cardObject = await getAccountObject("card", credential, accessToken, card);
          returnCards.push(cardObject);
        })
      );
    }
  }

  return returnCards;
}

async function getAccounts(accessToken, credential) {
  const returnAccounts = [];
  let accounts;

  if (credential.scopes.includes("accounts")) {
    try {
      console.log(`Fetching accounts for ${credential.credentials_id}`);
      accounts = await DataAPIClient.getAccounts(accessToken);
    } catch (e) {
      console.log(`Unable to fetch accounts ${credential.credentials_id}`);
      returnAccounts.push(noBalanceAccountObject(credential));
    }

    if (accounts) {
      await Promise.all(
        accounts.results.map(async (account) => {
          const accountObject = await getAccountObject("account", credential, accessToken, account);
          returnAccounts.push(accountObject);
        })
      );
    }
  }

  return returnAccounts;
}
