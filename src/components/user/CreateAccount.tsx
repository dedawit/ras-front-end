import React, { useState } from "react";
import { CreateAccountFormData, FormErrors } from "../types/user";
import { InputField } from "../forms/InputField";
import { SelectField } from "../forms/SelectField";
import { PasswordField } from "../forms/PasswordField";
import { createUser } from "../../services/api";
const initialFormData: CreateAccountFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  firstName: "",
  lastName: "",
  telephone: "",
  lastRole: "buyer",
};

export const CreateAccountForm: React.FC = () => {
  const [formData, setFormData] =
    useState<CreateAccountFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  const validatePassword = (password: string) => {
    const minLength = 10; // Change this to 10 for the 10.4 password rule
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&,.])[A-Za-z\d@$!%*?&,.]{10,}$/;

    // Check if password is empty
    if (!password) {
      return "Password is required";
    }
    // Check if password length is less than 8 (or any other minimum length you need)
    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long`;
    }
    // Check password complexity (uppercase, lowercase, digit, and special character)
    if (!passwordRegex.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }

    return "";
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^(09|07)\d{8}$/; // Starts with 09 or 07, followed by 8 digits

    if (!phoneNumber) {
      return "Phone number is required";
    }
    if (!phoneRegex.test(phoneNumber)) {
      return "Phone number must start with 09 or 07 and be 10 digits long";
    }

    return "";
  };
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.companyName)
      newErrors.companyName = "Company name is required";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.telephone) newErrors.telephone = "Phone number is required";
    const phoneError = validatePhoneNumber(formData.telephone);
    if (phoneError) {
      newErrors.telephone = phoneError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Remove confirmPassword from the formData before sending it
      const { confirmPassword, ...userData } = formData;

      // Use .then() to handle the Axios request
      createUser(userData)
        .then((newUser) => {
          console.log("User created:", newUser);
          // Optionally redirect or display success message
        })
        .catch((error) => {
          console.error("Error creating user:", error);
        });
    }
  };

  const updateField = (field: keyof CreateAccountFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-8 border rounded-lg shadow-lg max-w-2xl mx-auto bg-transparent border-color mt-20"
    >
      <h2 className="text-2xl font-bold text-center primary-color mb-8">
        Create Account
      </h2>

      <InputField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(value) => updateField("email", value)}
        error={errors.email}
        required
      />

      <PasswordField
        label="Password"
        value={formData.password}
        onChange={(value) => updateField("password", value)}
        error={errors.password}
        required
      />
      <PasswordField
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={(value) => updateField("confirmPassword", value)}
        error={errors.confirmPassword}
        required
      />

      <InputField
        label="Company Name"
        value={formData.companyName}
        onChange={(value) => updateField("companyName", value)}
        error={errors.companyName}
        required
      />

      <InputField
        label="First Name"
        value={formData.firstName}
        onChange={(value) => updateField("firstName", value)}
        error={errors.firstName}
        required
      />

      <InputField
        label="Last Name"
        value={formData.lastName}
        onChange={(value) => updateField("lastName", value)}
        error={errors.lastName}
        required
      />

      <InputField
        label="Phone Number"
        type="tel"
        value={formData.telephone} // Use 'telephone' instead of 'tel'
        onChange={(value) => updateField("telephone", value)} // Update the field correctly
        error={errors.telephone} // Use 'telephone' for the error message
        required
      />

      <SelectField
        label="Role"
        value={formData.lastRole}
        onChange={(value) => updateField("lastRole", value)}
        options={[
          { value: "buyer", label: "Buyer" },
          { value: "seller", label: "Seller" },
        ]}
        required
      />

      <button
        type="submit"
        className="w-full primary-color-bg text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Create Account
      </button>

      <p className="text-center text-sm primary-color">
        Already have an account?{" "}
        <a
          href="/login"
          className="primary-color underline hover:text-blue-700"
        >
          Login
        </a>
      </p>
    </form>
  );
};
