import { ChevronRight, ChevronDown } from "lucide-react"; // іконки з lucide-react

interface ArrowButtonProps {
  active: boolean;
  func: () => void;
}

function ArrowButton({ active, func }: ArrowButtonProps) {
  return (
    <button onClick={func} className="p-2 hover:opacity-80">
      {active ? (
        <ChevronDown size={48} strokeWidth={4} />
      ) : (
        <ChevronRight size={48} strokeWidth={4} />
      )}
    </button>
  );
}

export default ArrowButton;
