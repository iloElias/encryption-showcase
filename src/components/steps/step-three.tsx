"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import forge from "node-forge";
import { useStepsContext } from "@/context/StepsProvider";
import { Button, Card, Textarea, Spinner, Input } from "@nextui-org/react";

const StepThree: React.FC = () => {
  const {
    handleNextStep,

    fileContent,
    digitalSignature,
    setDigitalSignature,
    encryptedFile,
    setEncryptedFile,
    aesKey,
  } = useStepsContext();
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePrivateKeyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPrivateKey(reader.result as string);
      };
      reader.readAsText(file);
    }
  };

  const signFile = () => {
    if (fileContent && privateKey) {
      try {
        const privateKeyForge = forge.pki.privateKeyFromPem(privateKey);

        const md = forge.md.sha256.create();
        md.update(fileContent, "utf8");
        const signature = forge.util.encode64(privateKeyForge.sign(md));

        setDigitalSignature(signature);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Erro ao assinar o arquivo:", error.message);
        } else {
          console.error("Erro ao assinar o arquivo:", error);
        }
      }
    }
  };

  const encryptFile = async () => {
    if (fileContent && aesKey) {
      try {
        setIsProcessing(true);

        const encoder = new TextEncoder();
        const encodedContent = encoder.encode(fileContent);

        const keyBuffer = Uint8Array.from(
          aesKey.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
        );

        const cryptoKey = await window.crypto.subtle.importKey(
          "raw",
          keyBuffer,
          { name: "AES-CBC" },
          false,
          ["encrypt"]
        );

        const iv = window.crypto.getRandomValues(new Uint8Array(16));

        console.log(
          "AES IV:",
          Array.from(iv)
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join("")
        );

        const encrypted = await window.crypto.subtle.encrypt(
          {
            name: "AES-CBC",
            iv,
          },
          cryptoKey,
          encodedContent
        );

        const encryptedBase64 = btoa(
          String.fromCharCode(...new Uint8Array(encrypted))
        );

        setEncryptedFile(encryptedBase64);
        setIsProcessing(false);

        console.log("Conteúdo cifrado (Base64):", encryptedBase64);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Erro ao cifrar o arquivo:", error.message);
        } else {
          console.error("Erro ao cifrar o arquivo:", error);
        }
        setIsProcessing(false);
      }
    } else {
      console.error("O conteúdo do arquivo ou a chave AES está ausente!");
    }
  };

  return (
    <motion.div
      className="flex flex-col gap-6 bg-transparent"
      initial={{ opacity: 0, x: "-100vw" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Assinatura Digital</h3>
        <Input
          type="file"
          accept=".pem"
          onChange={handlePrivateKeyUpload}
          className="mb-4"
        />
        <Button
          disabled={!fileContent || !privateKey}
          onPress={signFile}
          color="primary"
          variant="flat"
        >
          Assinar Arquivo
        </Button>
        {digitalSignature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-4 bg-gray-100 p-4 rounded shadow"
          >
            <p className="font-mono text-sm">
              <strong>Assinatura Digital:</strong>
            </p>
            <Textarea
              readOnly
              rows={4}
              className="w-full"
              value={digitalSignature}
            />
          </motion.div>
        )}
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Cifragem do Arquivo</h3>
        <Button
          disabled={!fileContent || !aesKey || isProcessing}
          onPress={encryptFile}
          color="success"
          variant="flat"
        >
          {isProcessing ? <Spinner size="sm" /> : "Cifrar Arquivo"}
        </Button>
        {encryptedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-4 bg-gray-100 p-4 rounded shadow"
          >
            <p className="font-mono text-sm">
              <strong>Arquivo Cifrado (AES-256):</strong>
            </p>
            <Textarea
              readOnly
              rows={6}
              className="w-full"
              value={encryptedFile}
            />
          </motion.div>
        )}
      </Card>
      {encryptedFile && (
        <Card className="p-4">
          <AnimatePresence>
            <h3>
              Agora que você fez a assinatura digital e cifrou o arquivo,
              podemos prosseguir para a próxima etapa.
            </h3>
            <div className="flex justify-between">
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
            </div>
          </AnimatePresence>
        </Card>
      )}
    </motion.div>
  );
};

export default StepThree;
