import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { formatNumberWithCommas } from "../../utils/formatter";

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<null | {
    transactionId: string;
    amount: number;
    date: string;
    projectName: string;
  }>(null);

  const txRef = searchParams.get("tx_ref");

  useEffect(() => {
    if (txRef) {
      axios
        .get(`http://localhost:3000/payment/status?tx_ref=${txRef}`)
        .then((res) => {
          setPaymentDetails(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch payment details", err);
        });
    }
  }, [txRef]);

  return (
    <div className="flex items-center justify-center h-screen bg-blue-100 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-10 max-w-xl w-full text-center">
        <CheckCircleIcon className="h-20 w-20 text-blue-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-blue-800 mb-4">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-8">
          Your transaction has been processed successfully.
        </p>

        {paymentDetails ? (
          <div className="bg-blue-50 rounded-lg p-4 text-left mb-8 text-sm sm:text-base">
            <p>
              <strong>Project:</strong> {paymentDetails.projectName}
            </p>
            <p>
              <strong>Transaction ID:</strong> {paymentDetails.transactionId}
            </p>
            <p>
              <strong>Amount:</strong>{" "}
              {formatNumberWithCommas(Number(paymentDetails.amount))} ETB
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(paymentDetails.date).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-gray-400 italic mb-8">
            Loading payment details...
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
          <button
            className="w-full sm:w-auto px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            onClick={() => navigate("/login")}
          >
            Login to My Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
