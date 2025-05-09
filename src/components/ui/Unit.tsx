import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { BidItem } from "../../types/bid";

interface UnitDropdownProps {
  item: BidItem;
  index: number;
  units: string[];
  updateItem: (index: number, key: keyof BidItem, value: string) => void;
}

export const UnitDropdown = ({
  item,
  index,
  units,
  updateItem,
}: UnitDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (unit: string) => {
    updateItem(index, "unit", unit);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <td
      className="p-2 border min-w-[150px] relative"
      ref={dropdownRef as React.RefObject<HTMLTableDataCellElement>}
    >
      <button
        type="button"
        className="w-full flex justify-between items-center p-1 border rounded text-left bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{item.unit}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <ul className="absolute z-50 mt-1 w-full border rounded bg-white shadow-lg max-h-[175px] overflow-y-auto">
          {units.map((unit) => (
            <li
              key={unit}
              className="p-1 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(unit)}
            >
              {unit}
            </li>
          ))}
        </ul>
      )}
    </td>
  );
};
