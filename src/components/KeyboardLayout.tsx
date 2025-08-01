import { useState, useEffect } from "react";
import { KeyboardKey } from "./KeyboardKey";
import { HotkeyDescriptionDialog } from "./HotkeyDescriptionDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Download, Upload } from "lucide-react";

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
const DESCRIPTIONS_KEY = "hotkey-descriptions";
const EXCLUDED_KEYS_KEY = "excluded-keys";

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

// Function to load descriptions from localStorage
const loadDescriptions = (): Record<string, string> => {
  try {
    const saved = localStorage.getItem(DESCRIPTIONS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Failed to load descriptions from localStorage:", error);
    return {};
  }
};

// Function to save descriptions to localStorage
const saveDescriptions = (descriptions: Record<string, string>) => {
  try {
    localStorage.setItem(DESCRIPTIONS_KEY, JSON.stringify(descriptions));
  } catch (error) {
    console.error("Failed to save descriptions to localStorage:", error);
  }
};

// Function to load excluded keys from localStorage
const loadExcludedKeys = (): Set<string> => {
  try {
    const saved = localStorage.getItem(EXCLUDED_KEYS_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch (error) {
    console.error("Failed to load excluded keys from localStorage:", error);
    return new Set();
  }
};

// Function to save excluded keys to localStorage
const saveExcludedKeys = (excludedKeys: Set<string>) => {
  try {
    localStorage.setItem(EXCLUDED_KEYS_KEY, JSON.stringify(Array.from(excludedKeys)));
  } catch (error) {
    console.error("Failed to save excluded keys to localStorage:", error);
  }
};

export const KeyboardLayout = () => {
  const [currentCategory, setCurrentCategory] = useState<ModifierCategory>("ctrl+shift");
  const [takenKeys, setTakenKeys] = useState<Record<ModifierCategory, Set<string>>>(loadSavedKeys);
  const [isExcludeMode, setIsExcludeMode] = useState(false);
  const [descriptions, setDescriptions] = useState<Record<string, string>>(loadDescriptions);
  const [excludedKeys, setExcludedKeys] = useState<Set<string>>(loadExcludedKeys);
  const [descriptionDialog, setDescriptionDialog] = useState<{
    isOpen: boolean;
    keyCode: string;
    keyLabel: string;
  }>({ isOpen: false, keyCode: "", keyLabel: "" });

  useEffect(() => {
    saveKeys(takenKeys);
  }, [takenKeys]);

  useEffect(() => {
    saveDescriptions(descriptions);
  }, [descriptions]);

  useEffect(() => {
    saveExcludedKeys(excludedKeys);
  }, [excludedKeys]);

  // Handle exclude mode toggle
  const toggleExcludeKey = (keyCode: string) => {
    if (isModifierKey(keyCode)) {
      return; // Don't allow excluding modifier keys
    }

    setExcludedKeys(prev => {
      const newExcluded = new Set(prev);
      if (newExcluded.has(keyCode)) {
        newExcluded.delete(keyCode);
      } else {
        newExcluded.add(keyCode);
      }
      return newExcluded;
    });
  };

  const toggleKey = (keyCode: string) => {
    setTakenKeys(prev => {
      const newTakenKeys = { ...prev };
      const currentSet = new Set(prev[currentCategory]);
      
      if (currentSet.has(keyCode)) {
        currentSet.delete(keyCode);
        // Clear description when key becomes available
        const updatedDescriptions = { ...descriptions };
        delete updatedDescriptions[`${currentCategory}:${keyCode}`];
        setDescriptions(updatedDescriptions);
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

  // Export data as CSV
  const exportToCSV = () => {
    const csvContent = [
      "Category,KeyCode,Description",
      ...Object.entries(takenKeys).flatMap(([category, keys]) =>
        Array.from(keys).map(keyCode => 
          `${category},"${keyCode}","${descriptions[`${category}:${keyCode}`] || ""}"`
        )
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hotkey-configuration.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import data from CSV
  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        const lines = csvContent.split("\n").slice(1); // Skip header
        
        const newTakenKeys: Record<ModifierCategory, Set<string>> = {
          "ctrl+shift": new Set(),
          "ctrl+shift+alt": new Set(),
          "ctrl+alt": new Set(),
        };
        const newDescriptions: Record<string, string> = {};

        lines.forEach(line => {
          const match = line.match(/^([^,]+),"([^"]+)","([^"]*)"$/);
          if (match) {
            const [, category, keyCode, description] = match;
            if (category in newTakenKeys) {
              newTakenKeys[category as ModifierCategory].add(keyCode);
              if (description) {
                newDescriptions[`${category}:${keyCode}`] = description;
              }
            }
          }
        });

        setTakenKeys(newTakenKeys);
        setDescriptions(newDescriptions);
      } catch (error) {
        console.error("Failed to import CSV:", error);
      }
    };
    reader.readAsText(file);
    event.target.value = ""; // Reset input
  };

  // Handle key click with exclude mode or normal toggle
  const handleKeyClick = (keyCode: string, keyLabel: string) => {
    // If key is excluded and not in exclude mode, don't allow any interaction
    if (excludedKeys.has(keyCode) && !isExcludeMode) {
      return;
    }

    if (isExcludeMode) {
      toggleExcludeKey(keyCode);
      return;
    }

    if (!getKeyStatus(keyCode)) {
      // Open description dialog for new keys
      setDescriptionDialog({ isOpen: true, keyCode, keyLabel });
    } else {
      // Toggle key normally
      toggleKey(keyCode);
    }
  };

  const handleDescriptionSave = (description: string) => {
    setDescriptions(prev => ({
      ...prev,
      [`${currentCategory}:${descriptionDialog.keyCode}`]: description
    }));
    toggleKey(descriptionDialog.keyCode);
  };

  const handleDescriptionSkip = () => {
    toggleKey(descriptionDialog.keyCode);
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

        {/* Controls */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* Exclude Mode Toggle */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <Switch
                  id="exclude-mode"
                  checked={isExcludeMode}
                  onCheckedChange={setIsExcludeMode}
                />
                <Label htmlFor="exclude-mode">Exclude Keys Mode</Label>
              </div>
            </div>

            {/* Import/Export Controls */}
            <div className="flex justify-center gap-4">
              <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button
                onClick={() => document.getElementById("csv-import")?.click()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import CSV
              </Button>
              <input
                id="csv-import"
                type="file"
                accept=".csv"
                onChange={importFromCSV}
                className="hidden"
              />
            </div>
          </div>
        </Card>

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
                     onClick={() => handleKeyClick(key.code, key.label)}
                     disabled={isModifierKey(key.code) || (excludedKeys.has(key.code) && !isExcludeMode)}
                     isExcluded={excludedKeys.has(key.code)}
                     description={descriptions[`${currentCategory}:${key.code}`]}
                   />
                ))}
              </div>
            ))}
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-4">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Modifier keys (Ctrl, Alt, Shift) are disabled as they are part of the combination.</p>
            <p>Red indicator means the key combination is already assigned.</p>
            <p><strong>Enable "Exclude Keys Mode" to click keys and exclude them (gray).</strong></p>
            <p>Excluded keys cannot be interacted with unless in Exclude Keys Mode.</p>
            <p>When adding new hotkeys, you can optionally add a description or skip it.</p>
            <p>Descriptions are limited to 25 characters and will be shown under the key.</p>
          </div>
        </Card>

        <HotkeyDescriptionDialog
          isOpen={descriptionDialog.isOpen}
          onClose={() => setDescriptionDialog({ isOpen: false, keyCode: "", keyLabel: "" })}
          onSave={handleDescriptionSave}
          onSkip={handleDescriptionSkip}
          keyLabel={descriptionDialog.keyLabel}
          currentDescription={descriptions[`${currentCategory}:${descriptionDialog.keyCode}`]}
        />
      </div>
    </div>
  );
};