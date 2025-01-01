import { FC, useState } from "react";
import { UserMode } from "../../types/user";
import { cn } from "../../lib/utils";

const Mode: FC = () => {
  const [mode, setMode] = useState<UserMode>("buyer");

  return (
    <div className="px-4 py-2 mb-4">
      <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
        {(["buyer", "seller"] as UserMode[]).map((type) => (
          <button
            key={type}
            onClick={() => setMode(type)}
            className={cn(
              "flex items-center space-x-2 px-3 py-1.5 rounded-md flex-1 transition-colors",
              mode === type ? "bg-white shadow-sm" : "hover:bg-gray-200"
            )}
          >
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">
                {type === "buyer" ? "B" : "S"}
              </span>
            </div>
            <span className="capitalize text-sm">{type} Mode</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Mode;
