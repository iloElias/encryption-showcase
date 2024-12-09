"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createHash } from "crypto";
import { useStepsContext } from "@/context/StepsProvider";
import { Button, Card, Input, Textarea } from "@nextui-org/react";

const StepTwo: React.FC = () => {
  const {
    handleNextStep,

    rsaKeys,
    selectedFile,
    setSelectedFile,
    fileContent,
    setFileContent,
    fileHash,
    setFileHash,
    fileType,
    setFileType,
  } = useStepsContext();

  const [isProcessing, setIsProcessing] = useState(false);

  const publicKey = rsaKeys?.publicKey;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileType(file.type);

      const reader = new FileReader();
      setIsProcessing(true);

      if (file.type.startsWith("text/")) {
        reader.onload = () => {
          const content = reader.result as string;
          setFileContent(content);

          const hash = createHash("sha256").update(content).digest("hex");
          setFileHash(hash);
          setIsProcessing(false);
        };
        reader.readAsText(file);
      } else {
        reader.onload = () => {
          const arrayBuffer = reader.result as ArrayBuffer;

          const hash = createHash("sha256")
            .update(Buffer.from(arrayBuffer))
            .digest("hex");
          setFileHash(hash);
          setIsProcessing(false);
        };
        reader.readAsArrayBuffer(file);
      }
    }
  };

  return (
    <motion.div
      className="flex flex-col gap-6 bg-transparent"
      initial={{ opacity: 0, x: "-100vw" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {publicKey && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold">
            Chave Pública a ser Utilizada
          </h3>
          <Textarea
            readOnly
            rows={6}
            className="w-full mt-4"
            value={publicKey}
            label="Chave Pública"
          />
        </Card>
      )}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Upload de Arquivo</h3>
        <Input
          type="file"
          accept=".txt,.json,.png,.jpg,.jpeg,.pdf,.docx"
          onChange={handleFileUpload}
          className="mb-4"
        />
        {isProcessing && <p>Processando arquivo...</p>}
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4 bg-gray-100 rounded mt-4"
          >
            <p className="text-sm font-mono">
              <strong>Arquivo Selecionado:</strong> {selectedFile.name} (
              {fileType})
            </p>
            {fileContent && fileType?.startsWith("text/") && (
              <>
                <p className="mt-2 text-sm font-mono">
                  <strong>Conteúdo do Arquivo:</strong>
                </p>
                <Textarea
                  readOnly
                  rows={6}
                  className="w-full p-2 border rounded"
                  value={fileContent}
                />
              </>
            )}
            {fileHash && (
              <p className="mt-4 text-sm">
                <strong>Hash (SHA-256):</strong> {fileHash}
              </p>
            )}
          </motion.div>
        )}
      </Card>
      {selectedFile && (
        <Card className="p-4">
          <AnimatePresence>
            <h3>
              Agora que você já fez o upload do arquivo, podemos prosseguir para
              a próxima etapa.
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

export default StepTwo;
