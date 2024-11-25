interface StepProps {
  children: React.ReactNode;
  title: string;
  step: number;
  stepCount: number;
}

export default function Step({ children, title, step, stepCount }: StepProps) {
  return (
    <div
      className={`overflow-hidden transition-opacity duration-300 ${
        stepCount >= step ? "opacity-100" : "opacity-0 invisible"
      }`}
    >
      <p className="pb-2 text-zinc-950 text-lg font-bold">{title}</p>
      {children}
    </div>
  );
}
