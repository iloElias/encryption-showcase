import { useState } from "react";
import { motion } from "framer-motion";
import { createSign, randomBytes, createCipheriv } from "crypto";
import { useStepsContext } from "@/context/StepsProvider";

const StepThree: React.FC = () => {
  const { 
    fileContent, 
    digitalSignature, 
    setDigitalSignature, 
    encryptedFile, 
    setEncryptedFile, 
    aesKey 
  } = useStepsContext();
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [animationStage, setAnimationStage] = useState<"initial" | "transforming" | "completed">("initial");

  const aesIV = randomBytes(16);

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
        const signer = createSign("sha256");
        signer.update(fileContent);
        signer.end();
        const signature = signer.sign(privateKey, "base64");
        setDigitalSignature(signature);
      } catch (error) {
        console.error("Erro ao assinar o arquivo:", error);
      }
    }
  };

  const encryptFile = () => {
    if (fileContent && aesKey) {
      try {
        setAnimationStage("transforming"); // Inicia a animação
        const cipher = createCipheriv("aes-256-cbc", aesKey, aesIV);
        let encrypted = cipher.update(fileContent, "utf8", "base64");
        encrypted += cipher.final("base64");

        setTimeout(() => {
          setEncryptedFile(encrypted);
          setAnimationStage("completed"); // Finaliza a animação
        }, 2000); // Tempo da animação
      } catch (error) {
        console.error("Erro ao cifrar o arquivo:", error);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: "-100vw" }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="p-4"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Assinatura Digital</h3>
        <input
          type="file"
          accept=".pem"
          onChange={handlePrivateKeyUpload}
          className="mb-4"
        />
        <button
          onClick={signFile}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow"
        >
          Assinar Arquivo
        </button>
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
            <textarea
              readOnly
              rows={4}
              className="w-full p-2 border rounded"
              value={digitalSignature}
            />
          </motion.div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Cifragem do Arquivo</h3>
        <div className="flex flex-col items-center justify-center">
          {animationStage === "initial" && (
            <motion.div
              initial={{ scale: 1, rotate: 0 }}
              animate={{ scale: 1.2, rotate: 15 }}
              transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
              className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg"
            >
              📦
            </motion.div>
          )}
          {animationStage === "transforming" && (
            <motion.div
              initial={{ scale: 1, rotateY: 0 }}
              animate={{ scale: 1.5, rotateY: 180 }}
              transition={{ duration: 2 }}
              className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
            >
              🔒
            </motion.div>
          )}
          {animationStage === "completed" && (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            >
              🏦
            </motion.div>
          )}
        </div>
        <button
          onClick={encryptFile}
          className="mt-6 bg-green-500 text-white px-4 py-2 rounded shadow"
        >
          Cifrar Arquivo
        </button>
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
            <textarea
              readOnly
              rows={6}
              className="w-full p-2 border rounded"
              value={encryptedFile}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StepThree;
