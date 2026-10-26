/** Marks refresh tokens so they can never be used as access tokens (and vice versa). */
export const REFRESH_TOKEN_TYPE = 'refresh';

export interface RefreshTokenPayload {
	sub: number;
	tokenType: typeof REFRESH_TOKEN_TYPE;
	jti: string;
}
