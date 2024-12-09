import { motion } from "framer-motion";

interface StepProps {
  children: React.ReactNode;
  title: string;
  step: number;
  stepCount: number;
}

export default function Step({ children, title, step, stepCount }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={stepCount >= step ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`${
        stepCount == step ? "block" : "hidden"
      }`}
      id={`step-${step}`}
    >
      <p className="pb-2 text-zinc-950 text-lg font-bold">{title}</p>
      {children}
    </motion.div>
  );
}
