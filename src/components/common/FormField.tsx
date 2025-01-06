import React from "react";
import { FormFieldProps } from "../../types/rfq";

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  children,
  error,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <label className="w-32 text-gray-600 text-right me-4">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex-1">{children}</div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default FormField;
