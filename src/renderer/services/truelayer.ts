import * as request from "request-promise";
import publicIp from "public-ip";
import uuid from "uuid";

import { TrueLayerCardOrAccount, TrueLayerBalance, TrueLayerMe, TrueLayerDebug } from "../interfaces.ts";

const baseUrl = "https://api.truelayer.com";

async function requestOptions(url: string, accessToken: string) {
  return {
    uri: `${baseUrl}${url}?cacheBust=${uuid.v4()}`,
    headers: {
      Authorization: "Bearer " + accessToken,
      "X-PSU-IP": await publicIp.v4(), // Needed to get past 4 requests per day rate limit
    },
  };
}

async function performGet(url: string, accessToken: string) {
  const response = await request.get(await requestOptions(url, accessToken));
  return JSON.parse(response);
}

export async function fetchAccountBalance(accountId: string, accessToken: string): Promise<TrueLayerBalance> {
  return await performGet(`/data/v1/accounts/${accountId}/balance`, accessToken);
}

export async function fetchCardBalance(cardId: string, accessToken: string): Promise<TrueLayerBalance> {
  return await performGet(`/data/v1/cards/${cardId}/balance`, accessToken);
}

export async function fetchCards(accessToken: string): Promise<TrueLayerCardOrAccount> {
  return await performGet(`/data/v1/cards`, accessToken);
}

export async function fetchAccounts(accessToken: string): Promise<TrueLayerCardOrAccount> {
  return await performGet(`/data/v1/accounts`, accessToken);
}

export async function fetchMe(accessToken: string): Promise<TrueLayerMe> {
  return await performGet(`/data/v1/me`, accessToken);
}

export async function fetchDebug(accessToken: string): Promise<TrueLayerDebug> {
  const requestParams = {
    uri: "https://auth.truelayer.com/api/debug",
    json: true,
    body: {
      access_token: accessToken,
    },
  };

  return await request.post(requestParams);
}
