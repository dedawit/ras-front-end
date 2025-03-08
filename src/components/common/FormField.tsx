import React from "react";
import { FormFieldProps } from "../../types/rfq";

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  children,
  error,
}) => {
  return (
    <div className="flex flex-col sm:flex-row mb-4">
      <label className="w-full sm:w-32 text-gray-600 text-left sm:text-right sm:mr-4 mb-2 sm:mb-0 sm:min-w-[10rem]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex-1 w-full ">{children}</div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
