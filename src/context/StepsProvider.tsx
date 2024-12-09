import React, { createContext, useContext, useState, ReactNode } from "react";

interface StepsContextType {
  stepCount: number;
  startOver: () => void;
  handleNextStep: () => void;
  handlePreviousStep: () => void;

  rsaKeys: { publicKey: string; privateKey: string } | null;
  setRsaKeys: (keys: { publicKey: string; privateKey: string }) => void;
  aesKey: string | null;
  setAesKey: (key: string) => void;
  file: File | null;
  setFile: (file: File) => void;
  fileContent: string | null;
  setFileContent: (content: string) => void;
  fileHash: string | null;
  setFileHash: (hash: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File) => void;
  fileType: string | null;
  setFileType: (type: string) => void;
  digitalSignature: string | null;
  setDigitalSignature: (signature: string) => void;
  encryptedFile: string | null;
  setEncryptedFile: (encrypted: string) => void;
}

const StepsContext = createContext<StepsContextType | undefined>(undefined);

export const StepsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [rsaKeys, setRsaKeys] = useState<{
    publicKey: string;
    privateKey: string;
  } | null>(null);
  const [aesKey, setAesKey] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [digitalSignature, setDigitalSignature] = useState<string | null>(null);
  const [encryptedFile, setEncryptedFile] = useState<string | null>(null);

  const [stepCount, setStepCount] = useState<number>(1);

  const startOver = () => {
    setStepCount(1);

    localStorage.removeItem("rsaKeys");
    localStorage.removeItem("aesKey");
  };

  const handleNextStep = () => {
    if (stepCount < 6) {
      setStepCount(stepCount + 1);
    }
  };

  const handlePreviousStep = () => {
    if (stepCount > 1) {
      setStepCount(stepCount - 1);
    }
  };

  return (
    <StepsContext.Provider
      value={{
        stepCount,
        startOver,
        handleNextStep,
        handlePreviousStep,

        rsaKeys,
        setRsaKeys,
        aesKey,
        setAesKey,
        file,
        setFile,
        fileContent,
        setFileContent,
        fileHash,
        setFileHash,
        selectedFile,
        setSelectedFile,
        fileType,
        setFileType,
        digitalSignature,
        setDigitalSignature,
        encryptedFile,
        setEncryptedFile,
      }}
    >
      {children}
    </StepsContext.Provider>
  );
};

export const useStepsContext = () => {
  const context = useContext(StepsContext);
  if (!context) {
    throw new Error("useStepsContext must be used within a StepsProvider");
  }
  return context;
};
