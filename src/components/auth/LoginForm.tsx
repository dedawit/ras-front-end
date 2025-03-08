import React, { useReducer } from "react";
import { InputField } from "../forms/InputField";
import { PasswordField } from "../forms/PasswordField";
import { Spinner } from "../ui/Spinner";
import { Notification } from "../ui/Notification";
import { loginReducer, initialState } from "../../reducers/loginReducer";
import { authService } from "../../services/auth";
import { useNotification } from "../../hooks/useNotification";
import { FormErrors } from "../../types/user";
import { LoginErrors } from "../../types/auth";
import { Logo } from "../common/Logo";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Footer from "../ui/Footer";

export const LoginForm: React.FC = () => {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const { formData, errors, isLoading } = state;
  const { notification, showNotification, hideNotification } =
    useNotification();
  const navigate = useNavigate();
  const { setUser } = useUser();

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};
    const { formData } = state;

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";

    dispatch({ type: "SET_ERRORS", errors: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch({ type: "SET_LOADING", isLoading: true });

      try {
        const response = await authService.login(formData);
        const { accessToken: token, firstName, lastName, id } = response;
        const fullName = firstName + " " + lastName;

        // Store token in localStorage for persistence
        localStorage.setItem("authToken", token);

        // Set user in context
        setUser({ token, fullName, id });
        showNotification("success", "Login successful!");
        console.log(response);
        navigate("/rfqs");
        // Redirect after a short delay to show the success message
      } catch (error: any) {
        showNotification("error", error.message);
      } finally {
        dispatch({ type: "SET_LOADING", isLoading: false });
      }
    }
  };

  const updateField = (field: "email" | "password", value: string) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container">
        <Logo />
      </div>
      <div className="flex-grow flex items-center justify-center my-4">
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={hideNotification}
          />
        )}
        <div className="w-full max-w-md">
          <div className="space-y-4 p-8 border rounded-lg shadow-lg max-w-2xl mx-auto bg-transparent my-auto">
            <h2 className="text-2xl font-bold text-center primary-color mb-8">
              Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                label="Email"
                type="text"
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
              <div className="text-right">
                <a
                  href="/forgot-password"
                  className="primary-color text-sm hover:underline"
                >
                  Forgot Password
                </a>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full primary-color-bg text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <Spinner />
                    <span className="ml-2">Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
              <p className="text-center text-sm primary-color">
                Don't have an account?{" "}
                <a
                  href="/create-account"
                  className="primary-color underline custom-underline"
                >
                  Create Account
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
