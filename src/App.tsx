import React from "react";
import { Logo } from "./components/common/Logo";
import "./styles/style.css";
import { CreateAccountForm } from "./components/user/CreateAccount";

function App() {
  return (
    <>
      <div className="">
        <Logo />
      </div>

      <div className="my-4">
        <CreateAccountForm />
      </div>
    </>
  );
}

export default App;
