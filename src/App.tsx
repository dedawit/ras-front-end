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
import { UserProvider } from "./context/UserContext";
import Footer from "./components/ui/Footer";
import ViewRFQ from "./components/rfq/ViewRFQForm";
import EditRFQ from "./components/rfq/EditRFQ";
import { SellerRFQForm } from "./components/rfq/SellerRFQForm";
import ViewRFQSeller from "./components/rfq/ViewRFQSeller";
import Bid from "./components/rfq/Bid";
import { SellerBidList } from "./components/bid/SellerBidList";
import ViewBid from "./components/rfq/ViewBid";
import EditBid from "./components/bid/EditBid";
import { BuyerBidList } from "./components/bid/BuyerBidList";
import ViewBidBuyer from "./components/rfq/ViewBidBuyer";
import TransactionPage from "./components/transaction/TransactionPage";
import PaymentSuccessPage from "./components/transaction/PaymentSuccess";
import TransactionHistoryBuyer from "./components/transaction/TransactionHistoryBuyer";
import ViewTransaction from "./components/transaction/ViewTransaction";
function App() {
  return (
    <Router>
      {/* Routing logic */}
      <UserProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />

          <Route path="/" element={<CreateAccountForm />} />
          <Route path="/rfqs" element={<BuyerRFQForm />} />
          <Route path="/rfq-seller" element={<SellerRFQForm />} />

          <Route path="/rfqs/post-rfq" element={<PostRFQ />} />
          <Route path="/rfqs/view-rfq/:id" element={<ViewRFQ />} />
          <Route path="/rfq-seller/view-rfq/:id" element={<ViewRFQSeller />} />
          <Route path="/bids/single/:id" element={<Bid />} />
          <Route path="/bids" element={<SellerBidList />} />
          {/* <Route path="/rfqs/" element={<BuyerBidList />} /> */}

          <Route path="/bids/view-bid/:id" element={<ViewBid />} />
          <Route path="/bids/edit-bid/:id" element={<EditBid />} />

          <Route path="/rfqs/edit-rfq/:id" element={<EditRFQ />} />
          <Route path="/rfqs/view-quotes/:id" element={<BuyerBidList />} />
          <Route path="/rfqs/view-quotes/bid/:id" element={<ViewBidBuyer />} />
          <Route path="/transaction" element={<TransactionPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/transactions" element={<TransactionHistoryBuyer />} />
          <Route path="/transactions/view/:id" element={<ViewTransaction />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
