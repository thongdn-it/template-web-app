import { decode, sign, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import { SignatureAlgorithm } from "hono/utils/jwt/jwa";

type JWT_TOKEN_TYPE = "access" | "refresh";

export class JWTUtils {
  static async sign(
    data: {
      email: string;
      id: string;
      type: JWT_TOKEN_TYPE;
    },
    secret: string,
    expiresIn: number, // in seconds
    alg: SignatureAlgorithm = "HS256"
  ) {
    const iat = Math.floor(Date.now() / 1000);
    const payload: JWTPayload = {
      iat,
      exp: iat + expiresIn,
      sub: data.id,
      email: data.email,
      type: data.type,
    };
    payload.iat = iat;
    payload.exp = iat + expiresIn;

    return sign(payload, secret, alg);
  }

  static async verify(
    token: string,
    secret: string,
    alg: SignatureAlgorithm = "HS256"
  ) {
    try {
      const payload = await verify(token, secret, alg);
      return payload;
    } catch (error) {
      throw new Error("Invalid token", { cause: error });
    }
  }

  static decode(token: string) {
    try {
      const { payload } = decode(token);
      return payload;
    } catch (error) {
      throw new Error("Invalid token", { cause: error });
    }
  }

  /**
   * Create access and refresh tokens
   *
   * @param data.email user email
   * @param data.id user id
   * @param data.accessTokenExpiresIn access token expires in seconds
   * @param data.refreshTokenExpiresIn refresh token expires in seconds
   * @param secret secret key
   * @returns
   */
  static async createTokens(
    data: {
      /**
       * User email
       */
      email: string;
      /**
       * User id
       */
      id: string;
      /**
       * Access token expires in seconds
       * @default 24 * 60 * 60 (1 day)
       */
      accessTokenExpiresIn?: number;
      /**
       * Refresh token expires in seconds
       * @default 7 * 24 * 60 * 60 (7 days)
       * @description Refresh token is used to get a new access token when the access token expires.
       */
      refreshTokenExpiresIn?: number;
    },
    secret: string
  ) {
    const accessToken = await this.sign(
      {
        email: data.email,
        id: data.id,
        type: "access",
      },
      secret,
      data.accessTokenExpiresIn ?? 24 * 60 * 60
    );
    const refreshToken = await this.sign(
      {
        email: data.email,
        id: data.id,
        type: "refresh",
      },
      secret,
      data.refreshTokenExpiresIn ?? 7 * 24 * 60 * 60
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
