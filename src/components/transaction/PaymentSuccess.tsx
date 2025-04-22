import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../ui/SideBar";
import MobileHeader from "../ui/MobileHeader";
import Footer from "../ui/Footer";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-transparent w-full overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full overflow-y-auto">
        <MobileHeader showSearchIcon={false} />
        <div className="mt-4 sm:mt-24 md:max-w-4xl lg:max-w-5xl mx-auto p-6 bg-transparent rounded-3xl shadow-lg max-w-full">
          <div className="text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-primary-color mb-4">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your transaction has been processed successfully. You will receive
              a confirmation soon.
            </p>
            <button
              className="p-3 bg-primary-color text-white rounded-md hover:bg-blue-700"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
