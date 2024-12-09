"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { useStepsContext } from "@/context/StepsProvider";
import ImportModal from "../import-modal";

const StepOne: React.FC = () => {
  const { handleNextStep, rsaKeys, setRsaKeys, aesKey, setAesKey } =
    useStepsContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadingRSA, setLoadingRSA] = useState(false);
  const [modalContent, setModalContent] = useState<React.FC | null>(null);

  const generateRSAKeys = async () => {
    setLoadingRSA(true);
    try {
      const response = await fetch("/api/generateRSA");
      const data = await response.json();
      if (response.ok) {
        setRsaKeys({ publicKey: data.publicKey, privateKey: data.privateKey });
      } else {
        alert("Erro ao gerar as chaves RSA. Tente novamente.");
      }
    } catch (error) {
      alert("Erro ao conectar ao servidor.");
    } finally {
      setLoadingRSA(false);
    }
  };

  const generateAESKey = () => {
    const key = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    setAesKey(key);
  };

  const setInfoModal = () => {
    const ImportModal: React.FC = () => (
      <>
        <ModalHeader>
          <h3>Como Funcionam as Chaves RSA?</h3>
        </ModalHeader>
        <ModalBody>
          <p>
            RSA é um algoritmo de criptografia assimétrica que utiliza um par de
            chaves: uma pública e outra privada. A chave pública é utilizada
            para criptografar mensagens que só podem ser descriptografadas com a
            chave privada correspondente.
          </p>
          <p>
            A chave privada é utilizada para assinar mensagens, garantindo que
            foram enviadas por quem diz ser. A assinatura é verificada com a
            chave pública correspondente.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="success" variant="light" onPress={onClose}>
            Entendi
          </Button>
        </ModalFooter>
      </>
    );

    setModalContent(() => ImportModal);
    onOpen();
  };

  const setImportModal = () => {
    setModalContent(() => <ImportModal onClose={onClose} />);
    onOpen();
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

  return (
    <motion.div
      className="flex flex-col gap-6 bg-transparent"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose}>
        <ModalContent>{() => <>{modalContent}</>}</ModalContent>
      </Modal>
      <Card className="p-4">
        <h3>Geração de Chaves RSA</h3>
        <div className="flex gap-4 mt-4">
          <Button
            onClick={generateRSAKeys}
            disabled={loadingRSA}
            color="primary"
            variant="flat"
          >
            {loadingRSA ? <Spinner size="md" /> : "Gerar Chaves RSA"}
          </Button>
          <Button
            onClick={() => setImportModal()}
            color="secondary"
            variant="flat"
          >
            Importar Chave Pública
          </Button>
          <Button onClick={() => setInfoModal()} color="success" variant="flat">
            Como Funcionam as Chaves?
          </Button>
        </div>
        <AnimatePresence>
          {rsaKeys && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Textarea
                variant="bordered"
                label="Chave Pública"
                rows={4}
                readOnly
                value={rsaKeys.publicKey}
              />
              <Textarea
                label="Chave Privada"
                variant="bordered"
                rows={4}
                className="mt-4"
                readOnly
                value={rsaKeys.privateKey}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      <Card className="p-4">
        <h3>Geração de Chave Simétrica AES</h3>
        <Button
          onClick={generateAESKey}
          className="mt-4"
          color="success"
          variant="flat"
        >
          Gerar Chave AES
        </Button>
        <AnimatePresence>
          {aesKey && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Textarea
                variant="bordered"
                label="Chave AES"
                rows={1}
                readOnly
                value={aesKey}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      {aesKey && rsaKeys?.publicKey && rsaKeys?.privateKey && (
        <Card className="p-4">
          <AnimatePresence>
            <h3>
              Agora que você gerou suas chaves RSA e a chave simétrica AES, você
              já pode prosseguir para a próxima etapa.
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex gap-4"
              >
                <Button
                  onClick={() => {
                    const blob = new Blob([aesKey], {
                      type: "text/plain;charset=utf-8",
                    });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "aes_key.txt";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="mt-4"
                  color="primary"
                  variant="flat"
                >
                  Salvar Chave AES
                </Button>
                <Button
                  onClick={() => {
                    const blob = new Blob([rsaKeys.publicKey], {
                      type: "text/plain;charset=utf-8",
                    });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "rsa_public_key.pem";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="mt-4"
                  color="secondary"
                  variant="flat"
                >
                  Salvar Chave Pública RSA
                </Button>
                <Button
                  onClick={() => {
                    const blob = new Blob([rsaKeys.privateKey], {
                      type: "text/plain;charset=utf-8",
                    });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "rsa_private_key.pem";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="mt-4"
                  color="warning"
                  variant="flat"
                >
                  Salvar Chave Privada RSA
                </Button>
              </motion.div>
            </div>
          </AnimatePresence>
        </Card>
      )}
    </motion.div>
  );
};

export default StepOne;
