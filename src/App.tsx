import React from "react";
import { Logo } from "./components/common/Logo";
import "./styles/style.css";
import { LoginForm } from "./components/auth/LoginForm";
import { CreateAccountForm } from "./components/user/CreateAccount";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <Router>
      <div className="container">
        <Logo />
      </div>

      {/* Routing logic */}
      <div className="my-4">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          {/* Default route */}
          <Route path="/" element={<CreateAccountForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
