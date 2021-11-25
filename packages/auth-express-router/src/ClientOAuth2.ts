import ClientOAuth2 from 'client-oauth2';

type State = {
  tokenType: string,
  accessToken: string,
  expiresTime: number,
  expiresAt: Date,
}

export const _state: State = {
  tokenType: '',
  accessToken: '',
  expiresTime: 0,
  get expiresAt() {
    return new Date(this.expiresTime);
  },
}

export const client = new ClientOAuth2({
  clientId: String(process.env.LOCALFR_API_OAUTH2_CLIENT_ID),
  clientSecret: String(process.env.LOCALFR_API_OAUTH2_CLIENT_SECRET),
  accessTokenUri: String(process.env.LOCALFR_API_BASE_URL) + String(process.env.LOCALFR_API_OAUTH2_TOKEN_URI),
});

export function ttl(date: string): number {
  return Math.floor((Date.parse(date) - Date.now()) / 1000);
}

export let _refreshTimeout: NodeJS.Timeout;
export async function refreshApiToken(): Promise<void> {
  console.debug('refreshing token...');

  _refreshTimeout && clearTimeout(_refreshTimeout);

  return client
  .credentials
  .getToken()
  .then(response => {
    console.debug('access_token successfully negociated.');
    const { token_type, expires_in, access_token } = response.data;
    const ttl = ((+expires_in -1) * 1000);

    _state.tokenType = token_type;
    _state.accessToken = access_token;
    _state.expiresTime = Date.now() + ttl;

    _refreshTimeout = setTimeout(refreshApiToken, ttl);
    console.debug('access_token will be refreshed in %s seconds.', ttl / 1000);
  });
}