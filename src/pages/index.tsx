import { Button } from "@nextui-org/react";
import Header from "@/components/header";
import Step from "@/components/step";
import dynamic from "next/dynamic";
import StepTwo from "@/components/steps/step-two";
import StepThree from "@/components/steps/step-three";
import { useStepsContext } from "@/context/StepsProvider";
import StepFour from "@/components/steps/step-four";
import StepFive from "@/components/steps/step-five";
import StepSix from "@/components/steps/step-six";

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
        <main className="flex flex-col p-8 bg-gray-100 flex-1 max-w-[1260px] gap-4 pb-8">
          <div className="flex justify-center gap-4">
            <Button
              onClick={handlePreviousStep}
              className="p-2"
              variant={stepCount <= 1 ? "bordered" : "flat"}
              color={stepCount <= 1 ? "default" : "danger"}
              disabled={stepCount <= 1}
            >
              {stepCount <= 1 ? "Inicio" : "Voltar"}
            </Button>
            <Button
              onClick={startOver}
              className="p-2"
              variant={stepCount <= 1 ? "bordered" : "flat"}
              color={stepCount <= 1 ? "default" : "warning"}
            >
              Recomeçar
            </Button>
            <Button
              onClick={handleNextStep}
              className="p-2"
              variant={stepCount >= 6 ? "bordered" : "flat"}
              color={stepCount >= 6 ? "default" : "success"}
              disabled={stepCount >= 6}
            >
              {stepCount >= 6 ? "Fim" : "Proximo"}
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
            <StepFive />
          </Step>
          <Step
            step={6}
            stepCount={stepCount}
            title="Etapa 6 - Verificação e Descriptografia"
          >
            <StepSix />
          </Step>
        </main>
      </div>
    </div>
  );
}
