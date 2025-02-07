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
import { highlightText } from "../../../../../../shared/utils/textUtils.js";

export default function Combobox({
  subjects = [],
  onSelect,
  placeholder,
  defaultValue,
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (currentValue) => {
    const selectedValue = currentValue === 0 ? null : currentValue;
    setValue(selectedValue);
    setOpen(false);
    if (onSelect) onSelect(selectedValue);
  };

  const options = [{ id: 0, name: "Aucun" }, ...subjects];

  const filteredOptions = options.filter(
    (option) =>
      option.name &&
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {value !== null
            ? options.find((option) => option.id === value)?.name
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
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    onSelect={() => handleSelect(option.id)}
                    className="cursor-pointer"
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightText(option.name, searchTerm),
                      }}
                    />
                    <Check
                      className={cn(
                        "ml-auto",
                        value === option.id ? "opacity-100" : "opacity-0"
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
