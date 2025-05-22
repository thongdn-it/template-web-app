import { scrypt } from "@noble/hashes/scrypt.js";
import { bytesToHex, hexToBytes, randomBytes } from "@noble/hashes/utils";

export class HashUtils {
  static readonly DefaultScryptOpts = { N: 2 ** 16, r: 8, p: 1, dkLen: 32 };

  /**
   * Hashes a password using scrypt algorithm.
   * @param password The password to hash.
   * @returns The hashed password in the format:
   * `<algorithm>$<opts>$<salt>$<hash>`.
   */
  static async hashPassword(
    password: string,
    algorithm: "scrypt" = "scrypt"
  ): Promise<string> {
    const opts = HashUtils.DefaultScryptOpts;
    const salt = randomBytes(8);
    if (algorithm === "scrypt") {
      const passwordHash = scrypt(password, salt, opts);
      return `scrypt$N=${opts.N}&r=${opts.r}&p=${opts.p}&dkLen=${
        opts.dkLen
      }$${bytesToHex(salt)}$${bytesToHex(passwordHash)}`;
    }
    return "";
  }

  /**
   * Compares a password with a hashed password.
   * @param password The password to compare.
   * @param hashedPassword The hashed password to compare against.
   * @returns True if the passwords match, false otherwise.
   */
  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const [algorithm, hashOpts, salt, hash] = hashedPassword.split("$");
    if (algorithm === "scrypt") {
      const opts = hashOpts.split("&").reduce((acc, curr) => {
        const [key, value] = curr.split("=");
        acc[key] = parseInt(value, 10);
        return acc;
      }, {} as Record<string, number>);

      const scryptOpts = {
        N: opts.N ?? HashUtils.DefaultScryptOpts.N,
        r: opts.r ?? HashUtils.DefaultScryptOpts.r,
        p: opts.p ?? HashUtils.DefaultScryptOpts.p,
        dkLen: opts.dkLen ?? HashUtils.DefaultScryptOpts.dkLen,
      };

      const passwordHash = scrypt(password, hexToBytes(salt), scryptOpts);
      return bytesToHex(passwordHash) === hash;
    }
    throw new Error("Unsupported hash algorithm");
  }
}
