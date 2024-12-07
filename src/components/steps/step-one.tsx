"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStepsContext } from "@/context/StepsProvider";

const StepOne: React.FC = () => {
  const { rsaKeys, setRsaKeys, aesKey, setAesKey } = useStepsContext();
  const [loading, setLoading] = useState(false);

  const generateRSAKeys = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generateRSA");
      const data = await response.json();

      if (response.ok) {
        setRsaKeys({ publicKey: data.publicKey, privateKey: data.privateKey });
      } else {
        console.error("Error generating RSA keys:", data.error);
      }
    } catch (error) {
      console.error("Error fetching RSA keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAESKey = () => {
    const key = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    setAesKey(key);
  };

  useEffect(() => {
    if (rsaKeys) {
      localStorage.setItem("rsaKeys", JSON.stringify(rsaKeys));
    } else {
      localStorage.removeItem("rsaKeys");
    }

    if (aesKey) {
      localStorage.setItem("aesKey", aesKey);
    } else {
      localStorage.removeItem("aesKey");
    }
  }, [rsaKeys, aesKey]);

  const containerVariant = {
    hidden: { opacity: 0, x: "-100vw", scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      x: "100vw",
      scale: 0.8,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const portalVariant = {
    hidden: { scale: 0.95, opacity: 0, x: "-100vw", rotateY: 90 },
    visible: {
      scale: 1,
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariant}
      className="p-2 overflow-hidden"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Geração de Chaves RSA</h3>
        <motion.button
          onClick={generateRSAKeys}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.975 }}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow"
        >
          {loading ? "Gerando..." : "Gerar Chaves RSA"}
        </motion.button>

        <AnimatePresence>
          {rsaKeys && (
            <motion.div
              key="rsa-keys"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={portalVariant}
              className="mt-2 bg-gray-100 p-2 rounded shadow"
            >
              <p className="font-mono text-sm">
                <strong>Chave Pública:</strong>
              </p>
              <textarea
                rows={4}
                onChange={({ target: { value } }) => {
                  setRsaKeys({
                    publicKey: value,
                    privateKey: rsaKeys.privateKey,
                  });
                }}
                className="w-full p-2 mt-2 border rounded"
                value={rsaKeys.publicKey}
              />
              <p className="font-mono text-sm mt-4">
                <strong>Chave Privada:</strong>
              </p>
              <textarea
                rows={4}
                onChange={({ target: { value } }) => {
                  setRsaKeys({
                    publicKey: rsaKeys.publicKey,
                    privateKey: value,
                  });
                }}
                className="w-full p-2 mt-2 border rounded"
                value={rsaKeys.privateKey}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Geração de Chave Simétrica AES
        </h3>
        <div className="flex gap-4">
          <motion.button
            onClick={generateAESKey}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.975 }}
            className="bg-green-500 text-white p-2 rounded shadow"
          >
            Gerar Chave AES
          </motion.button>

          <AnimatePresence>
            {aesKey && (
              <motion.div
                key="aes-key"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={portalVariant}
                className="p-2 bg-gray-200 rounded shadow"
              >
                <strong>Chave AES:</strong>{" "}
                <code className="bg-gray-300 text-slate-600 p-1 rounded">
                  {aesKey}
                </code>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default StepOne;
