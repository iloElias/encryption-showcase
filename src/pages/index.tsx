import { Button } from "@nextui-org/react";
import Header from "@/components/header";
import Step from "@/components/step";
import dynamic from "next/dynamic";
import StepTwo from "@/components/steps/step-two";
import StepThree from "@/components/steps/step-three";
import { useStepsContext } from "@/context/StepsProvider";
import StepFour from "@/components/steps/step-four";

const StepOne = dynamic(() => import("@/components/steps/step-one"), {
  ssr: false,
});

export default function Home() {
  const { stepCount, startOver, handleNextStep, handlePreviousStep } =
    useStepsContext();

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex justify-center flex-1 max-w-full">
        <main className="flex flex-col p-8 bg-gray-100 flex-1 max-w-[1260px] gap-4">
          <div>
            <Button
              onClick={startOver}
              className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
            >
              Recomeçar
            </Button>
            <Button
              onClick={handleNextStep}
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Proximo
            </Button>
            <Button
              onClick={handlePreviousStep}
              className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
            >
              Voltar
            </Button>
          </div>
          <Step
            step={1}
            stepCount={stepCount}
            title="Etapa 1 - Configuração Inicial"
          >
            <StepOne />
          </Step>
          <Step
            step={2}
            stepCount={stepCount}
            title="Etapa 2 - Preparação do Ambiente"
          >
            <StepTwo />
          </Step>
          <Step
            step={3}
            stepCount={stepCount}
            title="Etapa 3 - Processo de Assinatura e Cifragem"
          >
            <StepThree />
          </Step>
          <Step
            step={4}
            stepCount={stepCount}
            title="Etapa 4 - Proteção da Chave Simétrica"
          >
            <StepFour />
          </Step>
          <Step
            step={5}
            stepCount={stepCount}
            title="Etapa 5 - Empacotamento e Simulação"
          >
            <p>Step 5</p>
          </Step>
          <Step
            step={6}
            stepCount={stepCount}
            title="Etapa 6 - Verificação e Descriptografia"
          >
            <p>Step 6</p>
          </Step>
        </main>
      </div>
    </div>
  );
}
