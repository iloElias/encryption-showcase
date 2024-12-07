import { motion } from "framer-motion";
import { createHash } from "crypto";
import { useStepsContext } from "@/context/StepsProvider";

const StepTwo: React.FC = () => {
  const {
    rsaKeys,
    setRsaKeys,
    selectedFile,
    setSelectedFile,
    fileContent,
    setFileContent,
    fileHash,
    setFileHash,
    fileType,
    setFileType,
  } = useStepsContext();

  const publicKey = rsaKeys?.publicKey;

  const handlePublicKeyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setRsaKeys({ publicKey: reader.result as string, privateKey: rsaKeys?.privateKey ?? "" });
      };
      reader.readAsText(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileType(file.type);

      const reader = new FileReader();

      if (file.type.startsWith("text/")) {
        reader.onload = () => {
          const content = reader.result as string;
          setFileContent(content);

          const hash = createHash("sha256").update(content).digest("hex");
          setFileHash(hash);
        };
        reader.readAsText(file);
      } else {
        reader.onload = () => {
          const arrayBuffer = reader.result as ArrayBuffer;

          const hash = createHash("sha256")
            .update(Buffer.from(arrayBuffer))
            .digest("hex");
          setFileHash(hash);
        };
        reader.readAsArrayBuffer(file);
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
        <h3 className="text-lg font-semibold mb-4">Importar Chave Pública</h3>
        <input
          type="file"
          accept=".pem,.txt,.pub"
          onChange={handlePublicKeyUpload}
          className="mb-4"
        />
        {publicKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4 bg-gray-100 rounded"
          >
            <p className="text-sm font-mono">
              <strong>Chave Pública Importada:</strong>
            </p>
            <textarea
              readOnly
              rows={6}
              className="w-full p-2 border rounded"
              value={publicKey}
            />
          </motion.div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Upload de Arquivo</h3>
        <input
          type="file"
          accept=".txt,.json,.png,.jpg,.jpeg,.pdf,.docx"
          onChange={handleFileUpload}
          className="mb-4"
        />
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4 bg-gray-100 rounded"
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
                <textarea
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
      </div>
    </motion.div>
  );
};

export default StepTwo;
