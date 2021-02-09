import { getRefreshToken, storeRefreshToken } from "./secure-storage.js";

import { fetchAccountBalance, fetchCardBalance, fetchCards, fetchAccounts } from "./truelayer.js";
import { refreshAccessToken } from "./truelayer-oauth.js";

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
  console.log(`[${credential.credentials_id}] Fetching balance for ${object.account_id}`);

  let balance;

  try {
    if (type === "account") {
      balance = await fetchAccountBalance(object.account_id, accessToken);
    } else if (type === "card") {
      balance = await fetchCardBalance(object.account_id, accessToken);
    }

    balance = balance.results[0];
    const useBalance = type === "card" ? -balance.current : balance.available;
    balance = new Intl.NumberFormat("gb-EN", { style: "currency", currency: balance.currency }).format(useBalance);
  } catch (e) {
    console.log(`[${credential.credentials_id}] Account balance fetch failure: ${object.account_id}`);
    balance = `Unable to get balance: ${e.error}`;
  }

  return {
    bank: bankObject(credential),
    name: object.display_name,
    balance: balance,
  };
}

function bankObject(credential) {
  return {
    name: credential.provider.display_name,
    icon: credential.provider.logo_uri.replace("/logo/", "/icon/"),
    logo: credential.provider.logo_uri,
  };
}

function noBalanceAccountObject(credential, error = "We have not been able to fetch accounts for this bank at this time. Either try again, or reconnect.") {
  return {
    bank: bankObject(credential),
    name: "Unable to fetch accounts",
    error: error,
  };
}

async function getAccountsForCredential(truelayerClientId, credential) {
  console.log(`[${credential.credentials_id}] Processing`);

  let accessToken;
  const accounts = [];

  const refreshToken = await getRefreshToken(credential);

  if (refreshToken) {
    try {
      console.log(`[${credential.credentials_id}] Fetching access token`);
      const refreshedToken = await refreshAccessToken(truelayerClientId, refreshToken);

      if (refreshedToken.refresh_token !== refreshToken) {
        console.log(`[${credential.credentials_id}] Updating stored refresh token`);
        await storeRefreshToken(credential, refreshedToken.refresh_token);
      }

      accessToken = refreshedToken.access_token;
    } catch (e) {
      console.log(`[${credential.credentials_id}] Unable to get access token: `, e.error);
      accounts.push(noBalanceAccountObject(credential, "We have been unable to refresh the access tokens, please disconnect and try again."));
    }

    if (accessToken) {
      console.log(`[${credential.credentials_id}] Fetching cards and accounts`);
      const accountsAndCards = await getAccountsAndCards(accessToken, credential);
      accounts.push(...accountsAndCards);
    }
  } else {
    console.log(`[${credential.credentials_id}] No refresh token found`);
    accounts.push(noBalanceAccountObject(credential, "No refresh token found, please reconnect."));
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
      console.log(`[${credential.credentials_id}] Fetching cards`);
      cards = await fetchCards(accessToken);
    } catch (e) {
      console.log(`[${credential.credentials_id}] Unable to fetch cards`, e.error);
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
  } else {
    console.log(`[${credential.credentials_id}] Skipping cards`);
  }

  return returnCards;
}

async function getAccounts(accessToken, credential) {
  const returnAccounts = [];
  let accounts;

  if (credential.scopes.includes("accounts")) {
    try {
      console.log(`[${credential.credentials_id}] Fetching accounts`);
      accounts = await fetchAccounts(accessToken);
    } catch (e) {
      console.log(`[${credential.credentials_id}] Unable to fetch accounts`);
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
  } else {
    console.log(`[${credential.credentials_id}] Skipping accounts`);
  }

  return returnAccounts;
}
