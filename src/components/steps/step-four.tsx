"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useStepsContext } from "@/context/StepsProvider";
import { Button, Card, Progress, Textarea } from "@nextui-org/react";
import forge from "node-forge";

const StepFour: React.FC = () => {
  const {
    handleNextStep,
    aesKey,
    rsaKeys,
    encryptedAESKey,
    setEncryptedAESKey,
  } = useStepsContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const pemToSpki = (pem: string): Uint8Array => {
    const publicKey = forge.pki.publicKeyFromPem(pem);
    const spki = forge.pki.publicKeyToAsn1(publicKey);
    const der = forge.asn1.toDer(spki).getBytes();
    return Uint8Array.from(der, (char) => char.charCodeAt(0));
  };

  const encryptAESKeyWithRSA = async () => {
    if (!aesKey || !rsaKeys?.publicKey) {
      throw new Error("A chave AES ou a chave pública RSA está ausente.");
    }

    try {
      setIsProcessing(true);
      setProgress(0);

      const publicKeyDer = pemToSpki(rsaKeys.publicKey);

      const publicKey = await window.crypto.subtle.importKey(
        "spki",
        publicKeyDer,
        { name: "RSA-OAEP", hash: { name: "SHA-256" } },
        false,
        ["encrypt"]
      );

      setProgress(50);

      const aesKeyBytes = Uint8Array.from(
        aesKey.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
      );

      const encrypted = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        aesKeyBytes
      );

      setProgress(100);

      const encryptedBase64 = btoa(
        String.fromCharCode(...new Uint8Array(encrypted))
      );
      setEncryptedAESKey(encryptedBase64);

      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      throw new Error("Erro ao cifrar a chave AES: " + error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: "-100vw" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="flex flex-col gap-6 bg-transparent"
    >
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          Por que este passo é necessário?
        </h3>
        <p>
          Neste passo, ciframos a chave simétrica (AES) com a chave pública do
          destinatário. Isso garante que apenas o destinatário, que possui a
          chave privada correspondente, possa descriptografar e usar a chave AES
          para acessar os dados cifrados.
        </p>
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          Cifragem da Chave Simétrica
        </h3>
        <Button
          disabled={isProcessing || !aesKey || !rsaKeys?.publicKey}
          onPress={encryptAESKeyWithRSA}
          color="primary"
          variant="flat"
        >
          {isProcessing ? "Processando..." : "Cifrar Chave AES com RSA"}
        </Button>
        {progress > 0 && (
          <Progress
            value={progress}
            size="sm"
            className="mt-4"
            color={progress === 100 ? "success" : "primary"}
          />
        )}
        {encryptedAESKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-6 bg-gray-100 p-4 rounded shadow"
          >
            <p className="font-mono text-sm">
              <strong>Chave Simétrica Cifrada (Base64):</strong>
            </p>
            <Textarea
              readOnly
              rows={6}
              className="w-full"
              value={encryptedAESKey}
            />
          </motion.div>
        )}
      </Card>
      {aesKey && encryptedAESKey && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Comparação de Tamanhos</h3>
          <p className="mb-2">
            <strong>Tamanho da Chave AES Original:</strong> {aesKey.length * 4}{" "}
            bits
          </p>
          <p>
            <strong>Tamanho da Chave AES Cifrada:</strong>{" "}
            {encryptedAESKey.length * 8} bits
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-4"
          >
            <Button
              onClick={handleNextStep}
              className="mt-4"
              color="success"
              variant="flat"
            >
              Próximo Passo
            </Button>
          </motion.div>
        </Card>
      )}
    </motion.div>
  );
};

export default StepFour;
