import * as request from "request-promise";
import publicIp from "public-ip";
import uuid from "uuid";
import moment from "moment";

const baseUrl = "https://api.truelayer.com";

async function requestOptions(url, accessToken) {
  if (url.includes("?")) {
    url += `&cacheBust=${uuid.v4()}`;
  } else {
    url += `?cacheBust=${uuid.v4()}`;
  }

  return {
    uri: `${baseUrl}${url}`,
    headers: {
      Authorization: "Bearer " + accessToken,
      "X-PSU-IP": await publicIp.v4(), // Needed to get past 4 requests per day rate limit
    },
  };
}

async function performGet(url, accessToken) {
  const response = await request.get(await requestOptions(url, accessToken));
  return JSON.parse(response);
}

export async function fetchAccountBalance(accountId, accessToken) {
  return await performGet(`/data/v1/accounts/${accountId}/balance`, accessToken);
}

export async function fetchCardBalance(cardId, accessToken) {
  return await performGet(`/data/v1/cards/${cardId}/balance`, accessToken);
}

export async function fetchCards(accessToken) {
  return await performGet(`/data/v1/cards`, accessToken);
}

export async function fetchAccounts(accessToken) {
  return await performGet(`/data/v1/accounts`, accessToken);
}

export async function fetchMe(accessToken) {
  return await performGet(`/data/v1/me`, accessToken);
}

export async function fetchAccountTransactions(accountId, accessToken) {
  const fromDateTime = moment().subtract(7, "days").toDate().toISOString();
  const toDateTime = moment().toDate().toISOString();
  return await performGet(`/data/v1/accounts/${accountId}/transactions?from=${fromDateTime}&to=${toDateTime}`, accessToken);
}

export async function fetchCardTransactions(cardId, accessToken) {
  const fromDateTime = moment().subtract(7, "days").toDate().toISOString();
  const toDateTime = moment().toDate().toISOString();
  return await performGet(`/data/v1/cards/${cardId}/transactions?from=${fromDateTime}&to=${toDateTime}`, accessToken);
}

export async function fetchAccountPendingTransactions(accountId, accessToken) {
  return await performGet(`/data/v1/accounts/${accountId}/transactions/pending`, accessToken);
}

export async function fetchCardPendingTransactions(cardId, accessToken) {
  try {
    return await performGet(`/data/v1/cards/${cardId}/transactions/pending`, accessToken);
  } catch (e) {
    console.log(e);
    return {
      results: [],
    };
  }
}

export async function fetchDebug(accessToken) {
  const requestParams = {
    uri: "https://auth.truelayer.com/api/debug",
    json: true,
    body: {
      access_token: accessToken,
    },
  };

  return await request.post(requestParams);
}
