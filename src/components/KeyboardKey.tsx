import { cn } from "@/lib/utils";

interface KeyboardKeyProps {
  keyLabel: string;
  keyCode: string;
  isWide?: boolean;
  isExtraWide?: boolean;
  isTaken: boolean;
  onClick: () => void;
  disabled?: boolean;
  isGamingKey?: boolean;
  description?: string;
}

export const KeyboardKey = ({ 
  keyLabel, 
  keyCode, 
  isWide = false, 
  isExtraWide = false,
  isTaken, 
  onClick,
  disabled = false,
  isGamingKey = false,
  description
}: KeyboardKeyProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative h-12 rounded-md border-2 font-mono text-sm font-medium transition-all duration-200 flex items-center justify-center",
        "bg-key-background border-key-border text-foreground",
        "hover:border-key-hover hover:shadow-lg hover:scale-105",
        "active:scale-95 active:shadow-sm",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        {
          "w-12": !isWide && !isExtraWide,
          "w-20": isWide,
          "w-32": isExtraWide,
          "border-key-taken bg-key-taken/20 text-key-taken": isTaken && !disabled && !isGamingKey,
          "border-key-available bg-key-available/20 text-key-available": !isTaken && !disabled && !isGamingKey,
          "border-key-gaming bg-key-gaming/20 text-key-gaming": isGamingKey,
        }
      )}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <span className="text-xs">{keyLabel}</span>
        {description && (
          <span className="text-[8px] text-muted-foreground mt-0.5 truncate max-w-full px-1">
            {description}
          </span>
        )}
      </div>
      {isTaken && !isGamingKey && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-key-taken rounded-full border border-background" />
      )}
      {isGamingKey && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-key-gaming rounded-full border border-background" />
      )}
    </button>
  );
};