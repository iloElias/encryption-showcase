import { Button } from "@nextui-org/react";
import Header from "@/components/header";
import StepContainer from "@/components/step-container";
import { useState } from "react";
import Step from "@/components/step";
import StepOne from "@/components/steps/step-one";

export default function Home() {
  const [stepCount, setStepCount] = useState(1);

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
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex justify-center flex-1 max-w-full">
        <main className="flex flex-col p-8 bg-gray-100 flex-1 max-w-[1260px] gap-4">
          <div>
            <Button
              onClick={handlePreviousStep}
              className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
            >
              Voltar
            </Button>
            <Button
              onClick={handleNextStep}
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Proximo
            </Button>
          </div>
          <Step
            step={1}
            stepCount={stepCount}
            title="Etapa 1 - Configuração Inicial"
          >
            <StepContainer>
              <StepOne />
            </StepContainer>
          </Step>
          <Step
            step={2}
            stepCount={stepCount}
            title="Etapa 2 - Preparação do Ambiente"
          >
            <StepContainer>
              <p>Step 2</p>
            </StepContainer>
          </Step>
          <Step
            step={3}
            stepCount={stepCount}
            title="Etapa 3 - Processo de Assinatura e Cifragem"
          >
            <StepContainer>
              <p>Step 3</p>
            </StepContainer>
          </Step>
          <Step
            step={4}
            stepCount={stepCount}
            title="Etapa 4 - Proteção da Chave Simétrica"
          >
            <StepContainer>
              <p>Step 4</p>
            </StepContainer>
          </Step>
          <Step
            step={5}
            stepCount={stepCount}
            title="Etapa 5 - Empacotamento e Simulação"
          >
            <StepContainer>
              <p>Step 5</p>
            </StepContainer>
          </Step>
          <Step
            step={6}
            stepCount={stepCount}
            title="Etapa 6 - Verificação e Descriptografia"
          >
            <StepContainer>
              <p>Step 6</p>
            </StepContainer>
          </Step>
        </main>
      </div>
    </div>
  );
}
