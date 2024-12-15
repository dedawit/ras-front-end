import axios from "axios";
const API_URL = "http://localhost:3000";

export interface UserData {
  firstName: string;
  lastName: string;
  companyName: string;
  telephone: string;
  email: string;
  password: string;
  lastRole: "buyer" | "seller";
  profile?: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to create a user
export const createUser = (userData: UserData) => {
  return api
    .post("/user/create", userData)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response
        ? error.response.data
        : new Error("An error occurred");
    });
};
