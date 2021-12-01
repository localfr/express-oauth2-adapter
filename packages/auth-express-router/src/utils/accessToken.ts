import { importSPKI, jwtVerify } from 'jose';
import env from '../env';

export const verify = async (token: string) => {
    return jwtVerify(
        token,
        await importSPKI(String(env.localfr.api.oauth2.publicKey), 'ES256'),
        { audience: env.localfr.api.oauth2.clientId }
    );
}