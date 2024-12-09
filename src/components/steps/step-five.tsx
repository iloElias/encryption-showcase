import { useState } from "react";
import { Button, Card, Progress } from "@nextui-org/react";
import { useStepsContext } from "@/context/StepsProvider";

const StepFive: React.FC = () => {
  const { handleNextStep, encryptedFile, digitalSignature, encryptedAESKey } =
    useStepsContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [finalFile, setFinalFile] = useState<string | null>(null);

  const generateFinalFile = async () => {
    if (!encryptedFile || !digitalSignature || !encryptedAESKey) {
      throw new Error(
        "Todos os elementos necessários devem estar disponíveis."
      );
    }

    try {
      setIsProcessing(true);
      setProgress(0);

      const finalData = JSON.stringify({
        encryptedFile,
        digitalSignature,
        encryptedAESKey,
      });

      const blob = new Blob([finalData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      setFinalFile(url);

      setProgress(100);
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      if (error instanceof Error) {
        throw new Error("Erro ao gerar o arquivo final: " + error.message);
      } else {
        throw new Error("Erro ao gerar o arquivo final.");
      }
    }
  };

  const simulateSendProcess = () => {
    if (!finalFile) {
      throw new Error("O arquivo final deve ser gerado antes do envio.");
    }

    alert("Simulação de envio realizada com sucesso!");
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Geração do Arquivo Final</h3>
        <p>
          O arquivo final será gerado combinando o arquivo cifrado, a assinatura
          digital e a chave simétrica cifrada.
        </p>
        <Button
          onPress={generateFinalFile}
          color="primary"
          disabled={isProcessing}
          className="mt-4"
        >
          {isProcessing ? "Processando..." : "Gerar Arquivo Final"}
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

      {finalFile && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Arquivo Final Gerado</h3>
          <a
            href={finalFile}
            download="dados-final.json"
            className="text-blue-600 underline"
          >
            Baixar Arquivo Final
          </a>
        </Card>
      )}
      <Card className="p-4">
        <h3 className="text-lg font-semibold">Simular Envio</h3>
        <p>
          Clique no botão abaixo para simular o envio do arquivo final ao
          destinatário.
        </p>
        <Button
          onPress={simulateSendProcess}
          color="success"
          disabled={!finalFile}
          className="mt-4"
        >
          Simular Envio
        </Button>
          <Button
            onClick={handleNextStep}
            className="mt-4"
            color="success"
            variant="flat"
          >
            Ultimo Passo
          </Button>
      </Card>
    </div>
  );
};

export default StepFive;
