export default function StepContainer({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-48 p-4 min-h-max bg-white shadow-md rounded-lg">
      <div className="border-2 border-dashed overflow-hidden border-gray-300 rounded-lg flex-auto text-lg font-medium text-gray-700 p-2">
        {children}
      </div>
    </div>
  );
}
