import { getTruelayerSecret } from "./secure-storage";

import { AuthAPIClient } from "truelayer-client";

import { fetchMe } from "./truelayer.js";

export async function credentialsFromUrl(truelayerClientId, url) {
  const fullUrl = new URL(url);
  const urlParams = new URLSearchParams(fullUrl.search);
  const code = urlParams.get("code");

  if (code) {
    const client = new AuthAPIClient({
      client_id: truelayerClientId,
      client_secret: await getTruelayerSecret(),
    });

    let tokens;
    let me;

    try {
      console.log("exchanging tokens");
      tokens = await client.exchangeCodeForToken("http://localhost/oauth", code);
    } catch (e) {
      console.log("tokens failure");
      console.log(e.error);
    }

    if (tokens) {
      try {
        console.log("getting /me");
        me = await fetchMe(tokens.access_token);
      } catch (e) {
        console.log("/me failure");
        console.log(e.error);
      }

      if (me) {
        return {
          refreshToken: tokens.refresh_token,
          credentials: me.results[0],
        };
      }
    }
  } else {
    console.log("No code found in URL");
  }
}
