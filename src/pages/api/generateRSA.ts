import { NextApiRequest, NextApiResponse } from "next";
import { generateKeyPairSync } from "crypto";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "pkcs1", format: "pem" },
      privateKeyEncoding: { type: "pkcs1", format: "pem" },
    });

    res.status(200).json({ publicKey, privateKey });
  } catch (error) {
    console.error("Error generating RSA keys:", error);
    res.status(500).json({ error: "Failed to generate RSA keys" });
  }
}
