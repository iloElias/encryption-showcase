import { useState } from "react";
import { Button, Card, Input, Progress, Textarea } from "@nextui-org/react";
import { motion } from "framer-motion";
import forge from "node-forge";
import { useStepsContext } from "@/context/StepsProvider";

const StepSix: React.FC = () => {
  const { handleNextStep, encryptedFile, digitalSignature, encryptedAESKey } =
    useStepsContext();
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const verifyAndDecrypt = async () => {
    if (
      !privateKey ||
      !encryptedFile ||
      !digitalSignature ||
      !encryptedAESKey
    ) {
      throw new Error(
        "Todos os elementos e a chave privada devem estar disponíveis."
      );
    }

    try {
      setIsProcessing(true);
      setProgress(0);

      const forgePrivateKey = forge.pki.privateKeyFromPem(privateKey);

      const encryptedAESKeyBytes = forge.util.decode64(encryptedAESKey);

      let aesKeyBytes;
      try {
        aesKeyBytes = forgePrivateKey.decrypt(
          encryptedAESKeyBytes,
          "RSA-OAEP",
          {
            md: forge.md.sha256.create(),
            mgf1: forge.md.sha256.create(),
          }
        );
      } catch (error) {
        throw new Error(
          "Falha ao descriptografar a chave AES: " + error.message
        );
      }

      setProgress(50);

      const aesKeyHex = forge.util.bytesToHex(aesKeyBytes);

      const encryptedFileBytes = forge.util.decode64(encryptedFile);
      const aesIV = encryptedFileBytes.slice(0, 16);
      const encryptedContent = encryptedFileBytes.slice(16);

      const decipher = forge.cipher.createDecipher(
        "AES-CBC",
        forge.util.hexToBytes(aesKeyHex)
      );
      decipher.start({ iv: forge.util.createBuffer(aesIV).getBytes() });
      decipher.update(forge.util.createBuffer(encryptedContent));
      const isDecrypted = decipher.finish();

      if (!isDecrypted) {
        throw new Error("Erro na descriptografia do arquivo.");
      }

      setProgress(75);

      const originalContent = decipher.output.toString();

      const md = forge.md.sha256.create();
      md.update(originalContent, "utf8");
      const signatureVerified = forge.pki.verifyMessageDigest(
        md,
        forge.util.decode64(digitalSignature)
      );

      if (!signatureVerified) {
        throw new Error("A verificação da assinatura falhou.");
      }

      setOriginalFile(originalContent);
      setProgress(100);
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      console.error("Erro durante a verificação e descriptografia:", error);
      throw new Error(
        "Erro ao verificar e descriptografar: " +
          (error instanceof Error ? error.message : "")
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: "-100vw" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="flex flex-col gap-6"
    >
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Upload da Chave Privada</h3>
        <Input
          type="file"
          accept=".pem"
          onChange={handlePrivateKeyUpload}
          className="mt-4"
        />
        {privateKey && (
          <Textarea
            readOnly
            value={privateKey}
            className="mt-4"
            rows={4}
            label="Chave Privada Carregada"
          />
        )}
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold">
          Processo de Verificação e Descriptografia
        </h3>
        <Button
          onPress={verifyAndDecrypt}
          disabled={isProcessing || !privateKey}
          color="primary"
        >
          {isProcessing ? "Processando..." : "Verificar e Descriptografar"}
        </Button>
        {progress > 0 && (
          <Progress
            value={progress}
            size="sm"
            color={progress === 100 ? "success" : "primary"}
            className="mt-4"
          />
        )}
      </Card>

      {originalFile && (
        <>
          <Card className="p-4">
            <h3 className="text-lg font-semibold">
              Arquivo Original Recuperado
            </h3>
            <Textarea
              readOnly
              value={originalFile}
              rows={6}
              label="Conteúdo Original"
            />
          </Card>
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
        </>
      )}
    </motion.div>
  );
};

export default StepSix;
