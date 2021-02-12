"use strict";

import { getRefreshToken, storeAccessToken, storeRefreshToken } from "./secure-storage.ts";

import { fetchAccountBalance, fetchCardBalance, fetchCards, fetchAccounts } from "./truelayer.js";
import { refreshAccessToken } from "./truelayer-oauth.ts";

import { ReturnedAccount, TrueLayerCardOrAccount, Credential } from "../interfaces.ts";

export async function refreshAllAccounts(truelayerClientId: string, credentials: Credential[]): Promise<ReturnedAccount[]> {
  const allAccounts: ReturnedAccount[] = [];

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

async function getAccountObject(type: string, credential: Credential, accessToken: string, object: TrueLayerCardOrAccount) {
  console.log(`[${credential.credentials_id}] Fetching balance for ${object.account_id}`);

  let balance;

  try {
    if (type === "account") {
      balance = await fetchAccountBalance(object.account_id, accessToken);
    } else if (type === "card") {
      balance = await fetchCardBalance(object.account_id, accessToken);
    }

    balance = balance.results[0];
    let useBalance = balance.available;

    // Use current balance for cards, and use a negative number (unless it's zero)
    if (type === "card") {
      useBalance = balance.current !== 0 ? -balance.current : 0;
    }

    balance = new Intl.NumberFormat("gb-EN", { style: "currency", currency: balance.currency }).format(useBalance);
  } catch (e) {
    console.error(`[${credential.credentials_id}] Account balance fetch failure: ${object.account_id}`);
    balance = `Unable to get balance: ${e.error}`;
  }

  return {
    bank: bankObject(credential),
    name: object.display_name,
    balance: balance,
  };
}

function bankObject(credential: Credential) {
  return {
    name: credential.provider.display_name,
    icon: credential.provider.logo_uri.replace("/logo/", "/icon/"),
    logo: credential.provider.logo_uri,
  };
}

function noBalanceAccountObject(credential: Credential, error = "We have not been able to fetch accounts for this bank at this time. Either try again, or reconnect.") {
  return {
    bank: bankObject(credential),
    name: "Unable to fetch accounts",
    error: error,
  };
}

async function getAccountsForCredential(truelayerClientId: string, credential: Credential) {
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
      await storeAccessToken(credential, accessToken); // We store this for debugging later. It's not used directly yet.
    } catch (e) {
      console.error(`[${credential.credentials_id}] Unable to get access token: `, e.error);
      accounts.push(noBalanceAccountObject(credential, "We have been unable to refresh the access tokens, please disconnect and try again."));
    }

    if (accessToken) {
      console.log(`[${credential.credentials_id}] Fetching cards and accounts`);
      const accountsAndCards = await getAccountsAndCards(accessToken, credential);
      accounts.push(...accountsAndCards);
    }
  } else {
    console.error(`[${credential.credentials_id}] No refresh token found`);
    accounts.push(noBalanceAccountObject(credential, "No refresh token found, please reconnect."));
  }

  return accounts;
}

async function getAccountsAndCards(accessToken: string, credential: Credential) {
  const [accounts, cards] = await Promise.all([getAccounts(accessToken, credential), getCards(accessToken, credential)]);
  return [...accounts, ...cards];
}

async function getCards(accessToken: string, credential: Credential) {
  const returnCards = [];
  let cards;

  if (credential.scopes.includes("cards")) {
    try {
      console.log(`[${credential.credentials_id}] Fetching cards`);
      cards = await fetchCards(accessToken);
    } catch (e) {
      console.error(`[${credential.credentials_id}] Unable to fetch cards`, e.error);
      returnCards.push(noBalanceAccountObject(credential));
    }

    if (cards) {
      await Promise.all(
        cards.results.map(async (card: TrueLayerCardOrAccount) => {
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

async function getAccounts(accessToken: string, credential: Credential) {
  const returnAccounts = [];
  let accounts;

  if (credential.scopes.includes("accounts")) {
    try {
      console.log(`[${credential.credentials_id}] Fetching accounts`);
      accounts = await fetchAccounts(accessToken);
    } catch (e) {
      console.error(`[${credential.credentials_id}] Unable to fetch accounts`);
      returnAccounts.push(noBalanceAccountObject(credential));
    }

    if (accounts) {
      await Promise.all(
        accounts.results.map(async (account: TrueLayerCardOrAccount) => {
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
