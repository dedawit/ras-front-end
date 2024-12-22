import { LoginErrors } from "../types/auth";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormState {
  formData: LoginFormData;
  errors: {
    email?: string;
    password?: string;
  };
  isLoading: boolean;
  errorMessage: string | null;
}

type LoginFormAction =
  | { type: "UPDATE_FIELD"; field: keyof LoginFormData; value: string }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_ERROR"; message: string }
  | { type: "SET_ERRORS"; errors: LoginErrors }
  | { type: "CLEAR_ERROR" };

export const initialState: LoginFormState = {
  formData: {
    email: "",
    password: "",
  },
  errors: {},
  isLoading: false,
  errorMessage: null,
};

export function loginReducer(
  state: LoginFormState,
  action: LoginFormAction
): LoginFormState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
        errors: {
          ...state.errors,
          [action.field]: undefined,
        },
        errorMessage: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case "SET_ERROR":
      return {
        ...state,
        errorMessage: action.message,
      };
    case "SET_ERRORS":
      return {
        ...state,
        errors: action.errors,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        errorMessage: null,
      };
    default:
      return state;
  }
}
