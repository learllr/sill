"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { highlightText } from "../../../../../shared/utils/textUtils.js";

export default function Combobox({
  subjects,
  onSelect,
  placeholder,
  defaultValue,
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || "");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (currentValue) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    if (onSelect) onSelect(currentValue);
  };

  const options = [{ label: "Aucun", value: 0 }, ...subjects];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder || "Sélectionnez une option..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
            onInput={(e) => setSearchTerm(e.target.value)}
          />
          <ScrollArea className="max-h-48 overflow-y-auto">
            <CommandList>
              <CommandEmpty>Aucune option trouvée.</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className="cursor-pointer"
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightText(option.label, searchTerm),
                        }}
                      />
                      <Check
                        className={cn(
                          "ml-auto",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
