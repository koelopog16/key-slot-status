import { useState, useEffect } from "react";
import { KeyboardKey } from "./KeyboardKey";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ModifierCategory = "ctrl+shift" | "ctrl+shift+alt" | "ctrl+alt";

interface KeyData {
  label: string;
  code: string;
  isWide?: boolean;
  isExtraWide?: boolean;
}

const keyboardRows: KeyData[][] = [
  // Number row
  [
    { label: "`", code: "Backquote" },
    { label: "1", code: "Digit1" },
    { label: "2", code: "Digit2" },
    { label: "3", code: "Digit3" },
    { label: "4", code: "Digit4" },
    { label: "5", code: "Digit5" },
    { label: "6", code: "Digit6" },
    { label: "7", code: "Digit7" },
    { label: "8", code: "Digit8" },
    { label: "9", code: "Digit9" },
    { label: "0", code: "Digit0" },
    { label: "-", code: "Minus" },
    { label: "=", code: "Equal" },
    { label: "⌫", code: "Backspace", isWide: true },
  ],
  // First letter row
  [
    { label: "Tab", code: "Tab", isWide: true },
    { label: "Q", code: "KeyQ" },
    { label: "W", code: "KeyW" },
    { label: "E", code: "KeyE" },
    { label: "R", code: "KeyR" },
    { label: "T", code: "KeyT" },
    { label: "Y", code: "KeyY" },
    { label: "U", code: "KeyU" },
    { label: "I", code: "KeyI" },
    { label: "O", code: "KeyO" },
    { label: "P", code: "KeyP" },
    { label: "[", code: "BracketLeft" },
    { label: "]", code: "BracketRight" },
    { label: "\\", code: "Backslash" },
  ],
  // Second letter row
  [
    { label: "Caps", code: "CapsLock", isWide: true },
    { label: "A", code: "KeyA" },
    { label: "S", code: "KeyS" },
    { label: "D", code: "KeyD" },
    { label: "F", code: "KeyF" },
    { label: "G", code: "KeyG" },
    { label: "H", code: "KeyH" },
    { label: "J", code: "KeyJ" },
    { label: "K", code: "KeyK" },
    { label: "L", code: "KeyL" },
    { label: ";", code: "Semicolon" },
    { label: "'", code: "Quote" },
    { label: "Enter", code: "Enter", isWide: true },
  ],
  // Third letter row
  [
    { label: "Shift", code: "ShiftLeft", isWide: true },
    { label: "Z", code: "KeyZ" },
    { label: "X", code: "KeyX" },
    { label: "C", code: "KeyC" },
    { label: "V", code: "KeyV" },
    { label: "B", code: "KeyB" },
    { label: "N", code: "KeyN" },
    { label: "M", code: "KeyM" },
    { label: ",", code: "Comma" },
    { label: ".", code: "Period" },
    { label: "/", code: "Slash" },
    { label: "Shift", code: "ShiftRight", isWide: true },
  ],
  // Bottom row
  [
    { label: "Ctrl", code: "ControlLeft", isWide: true },
    { label: "Alt", code: "AltLeft", isWide: true },
    { label: "Space", code: "Space", isExtraWide: true },
    { label: "Alt", code: "AltRight", isWide: true },
    { label: "Ctrl", code: "ControlRight", isWide: true },
  ],
];

const STORAGE_KEY = "keyboard-hotkeys-config";

const loadSavedKeys = (): Record<ModifierCategory, Set<string>> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        "ctrl+shift": new Set(parsed["ctrl+shift"] || []),
        "ctrl+shift+alt": new Set(parsed["ctrl+shift+alt"] || []),
        "ctrl+alt": new Set(parsed["ctrl+alt"] || []),
      };
    }
  } catch (error) {
    console.warn("Failed to load saved hotkeys:", error);
  }
  
  // Default configuration
  return {
    "ctrl+shift": new Set(),
    "ctrl+shift+alt": new Set(),
    "ctrl+alt": new Set(),
  };
};

const saveKeys = (keys: Record<ModifierCategory, Set<string>>) => {
  try {
    const serializable = {
      "ctrl+shift": Array.from(keys["ctrl+shift"]),
      "ctrl+shift+alt": Array.from(keys["ctrl+shift+alt"]),
      "ctrl+alt": Array.from(keys["ctrl+alt"]),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch (error) {
    console.warn("Failed to save hotkeys:", error);
  }
};

export const KeyboardLayout = () => {
  const [currentCategory, setCurrentCategory] = useState<ModifierCategory>("ctrl+shift");
  const [takenKeys, setTakenKeys] = useState<Record<ModifierCategory, Set<string>>>(loadSavedKeys);

  useEffect(() => {
    saveKeys(takenKeys);
  }, [takenKeys]);

  const toggleKey = (keyCode: string) => {
    setTakenKeys(prev => {
      const newTakenKeys = { ...prev };
      const currentSet = new Set(prev[currentCategory]);
      
      if (currentSet.has(keyCode)) {
        currentSet.delete(keyCode);
      } else {
        currentSet.add(keyCode);
      }
      
      newTakenKeys[currentCategory] = currentSet;
      return newTakenKeys;
    });
  };

  const getKeyStatus = (keyCode: string) => {
    return takenKeys[currentCategory].has(keyCode);
  };

  const isModifierKey = (keyCode: string) => {
    return ["ControlLeft", "ControlRight", "AltLeft", "AltRight", "ShiftLeft", "ShiftRight"].includes(keyCode);
  };

  const getCategoryLabel = (category: ModifierCategory) => {
    switch (category) {
      case "ctrl+shift": return "Ctrl + Shift";
      case "ctrl+shift+alt": return "Ctrl + Shift + Alt";
      case "ctrl+alt": return "Ctrl + Alt";
    }
  };

  const getCategoryStats = (category: ModifierCategory) => {
    const taken = takenKeys[category].size;
    const total = keyboardRows.flat().filter(key => !isModifierKey(key.code)).length;
    return { taken, total };
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Keyboard Hotkey Manager</h1>
          <p className="text-muted-foreground">Manage your soundboard and application hotkeys</p>
        </div>

        {/* Category Selector */}
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Modifier Categories</h2>
            <div className="flex flex-wrap gap-3">
              {(["ctrl+shift", "ctrl+shift+alt", "ctrl+alt"] as ModifierCategory[]).map((category) => {
                const stats = getCategoryStats(category);
                return (
                  <Button
                    key={category}
                    variant={currentCategory === category ? "default" : "secondary"}
                    onClick={() => setCurrentCategory(category)}
                    className="flex flex-col items-center gap-1 h-auto py-3 px-4"
                  >
                    <span className="font-medium">{getCategoryLabel(category)}</span>
                    <span className="text-xs opacity-75">
                      {stats.taken}/{stats.total} taken
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Current Category Info */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-foreground">
                Current: {getCategoryLabel(currentCategory)}
              </h3>
              <p className="text-sm text-muted-foreground">
                Click keys to toggle their status
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-key-available rounded-full"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-key-taken rounded-full"></div>
                <span>Taken</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Keyboard */}
        <Card className="p-8">
          <div className="space-y-3">
            {keyboardRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-2 justify-center">
                {row.map((key) => (
                  <KeyboardKey
                    key={key.code}
                    keyLabel={key.label}
                    keyCode={key.code}
                    isWide={key.isWide}
                    isExtraWide={key.isExtraWide}
                    isTaken={getKeyStatus(key.code)}
                    onClick={() => toggleKey(key.code)}
                    disabled={isModifierKey(key.code)}
                  />
                ))}
              </div>
            ))}
          </div>
        </Card>

        {/* Legend */}
        <Card className="p-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Modifier keys (Ctrl, Alt, Shift) are disabled as they are part of the combination.</p>
            <p>Red indicator means the key combination is already assigned.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};