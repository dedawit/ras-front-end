import React from "react";
import { Logo } from "./components/common/Logo";
import "./styles/style.css";
import { LoginForm } from "./components/auth/LoginForm";
import { CreateAccountForm } from "./components/user/CreateAccount";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/ui/SideBar";
import Header from "./components/ui/Header";
import RFQList from "./components/rfq/RFQList";
import { BuyerRFQForm } from "./components/rfq/BuyerRFQForm";
import PostRFQ from "./components/rfq/PostRFQForm";
function App() {
  return (
    <Router>
      {/* Routing logic */}

      <Routes>
        <Route path="/login" element={<LoginForm />} />

        <Route path="/" element={<CreateAccountForm />} />
        <Route path="/rfqs" element={<BuyerRFQForm />} />
        <Route path="/rfqs/post-rfq" element={<PostRFQ />} />
      </Routes>
    </Router>
  );
}

export default App;
