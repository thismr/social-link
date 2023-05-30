const crypto = require("crypto");

export function encrypt(data) {
  const algorithm = "aes-256-cbc";

  // generate 16 bytes of random data
  const initVector = crypto.randomBytes(16);

  // secret key generate 32 bytes of random data
  const Securitykey = crypto.randomBytes(32);

  // the cipher function
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

  // encrypt the message
  // input encoding
  // output encoding
  let encryptedData = cipher.update(data, "utf-8", "hex");

  encryptedData += cipher.final("hex");

  return encryptedData;
}
