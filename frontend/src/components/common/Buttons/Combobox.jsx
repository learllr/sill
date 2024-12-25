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
import { highlightText } from "../../../../utils/textUtils.js";

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? subjects.find((subject) => subject.value === value)?.label
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
                {subjects
                  .filter((subject) =>
                    subject.label
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((subject) => (
                    <CommandItem
                      key={subject.value}
                      value={subject.value}
                      onSelect={() => handleSelect(subject.value)}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightText(subject.label, searchTerm),
                        }}
                      />
                      <Check
                        className={cn(
                          "ml-auto",
                          value === subject.value ? "opacity-100" : "opacity-0"
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
