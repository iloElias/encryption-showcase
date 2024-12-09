import { useStepsContext } from "@/context/StepsProvider";
import {
  Button,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { useState } from "react";

interface ImportModalProps {
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ onClose }: ImportModalProps) => {
  const { rsaKeys, setRsaKeys } = useStepsContext();
  const [publicKeyInput, setPublicKeyInput] = useState<string>("");
  const handleImport = () => {
    if (publicKeyInput.trim()) {
      setRsaKeys({ ...rsaKeys, publicKey: publicKeyInput });
      onClose();
    } else {
      alert("A chave pública não pode estar vazia.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPublicKeyInput(e.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <ModalHeader>
        <h3>Importar Chave Pública</h3>
      </ModalHeader>
      <ModalBody>
        <p>
          Insira sua chave pública no campo abaixo ou selecione um arquivo
          contendo a chave no formato PEM.
        </p>
        <Input
          type="file"
          accept=".pem,.txt"
          onChange={handleFileChange}
          className="w-full cursor-pointer"
          variant="flat"
        />
        <Textarea
          value={publicKeyInput}
          onChange={(e) => setPublicKeyInput(e.target.value)}
          variant="bordered"
          label="Chave Pública"
          placeholder="Cole aqui sua chave pública ou importe um arquivo acima"
          rows={4}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="danger" variant="light" onPress={onClose}>
          Cancelar
        </Button>
        <Button color="primary" onPress={handleImport}>
          Importar
        </Button>
      </ModalFooter>
    </>
  );
};

export default ImportModal;
