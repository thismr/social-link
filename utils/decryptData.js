const crypto = require("crypto");

export function decrypt(encryptedData) {
  const algorithm = "aes-256-cbc";

  // generate 16 bytes of random data
  const initVector = crypto.randomBytes(16);

  // secret key generate 32 bytes of random data
  const Securitykey = crypto.randomBytes(32);

  // the decipher function
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);

  let decryptedData = decipher.update(encryptedData, "hex", "utf-8");

  decryptedData += decipher.final("utf8");

  return decryptedData;
}
