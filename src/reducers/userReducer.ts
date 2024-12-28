import { CreateAccountFormData, FormErrors, FormState } from "../types/user";

export type FormAction =
  | { type: "UPDATE_FIELD"; field: keyof CreateAccountFormData; value: string }
  | { type: "SET_ERRORS"; errors: FormErrors }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_SUCCESS"; message: string }
  | { type: "SET_ERROR"; message: string }
  | { type: "CLEAR_MESSAGES" };

export const initialFormData: CreateAccountFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  companyName: "",
  firstName: "",
  lastName: "",
  telephone: "",
  lastRole: "buyer",
};

export const initialState: FormState = {
  formData: initialFormData,
  errors: {},
  isLoading: false,
  successMessage: null,
  errorMessage: null,
};

export function formReducer(state: FormState, action: FormAction): FormState {
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
      };
    case "SET_ERRORS":
      return {
        ...state,
        errors: action.errors,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case "SET_SUCCESS":
      return {
        ...state,
        successMessage: action.message,
        errorMessage: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        errorMessage: action.message,
        successMessage: null,
      };
    case "CLEAR_MESSAGES":
      return {
        ...state,
        successMessage: null,
        errorMessage: null,
      };
    default:
      return state;
  }
}
