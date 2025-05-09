import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { LoginForm } from "./components/auth/LoginForm";
import { CreateAccountForm } from "./components/user/CreateAccount";
import Sidebar from "./components/ui/SideBar";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import RFQList from "./components/rfq/RFQList";
import { BuyerRFQForm } from "./components/rfq/BuyerRFQForm";
import PostRFQ from "./components/rfq/PostRFQForm";
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
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ProductDashboard } from "./components/product/ProductDashboard";
import { ProductForm } from "./components/product/ProductForm";
import EditProductCard from "./components/product/EditProduct";
import Landing from "./components/landing/Landing";

const App: React.FC = () => {
  return (
    <Router>
      <UserProvider>
        <Routes>
          {/* Unprotected Routes */}
          <Route path="/create-account" element={<CreateAccountForm />} />
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />

          {/* Protected Routes with Layout */}

          {/* Buyer-only Routes */}
          <Route
            path="/rfqs"
            element={
              <ProtectedRoute roles={["buyer"]} component={<BuyerRFQForm />} />
            }
          />
          <Route
            path="/rfqs/post-rfq"
            element={
              <ProtectedRoute roles={["buyer"]} component={<PostRFQ />} />
            }
          />
          <Route
            path="/rfqs/view-rfq/:id"
            element={
              <ProtectedRoute roles={["buyer"]} component={<ViewRFQ />} />
            }
          />
          <Route
            path="/rfqs/edit-rfq/:id"
            element={
              <ProtectedRoute roles={["buyer"]} component={<EditRFQ />} />
            }
          />
          <Route
            path="/rfqs/view-quotes/:id"
            element={
              <ProtectedRoute roles={["buyer"]} component={<BuyerBidList />} />
            }
          />
          <Route
            path="/rfqs/view-quotes/bid/:id"
            element={
              <ProtectedRoute roles={["buyer"]} component={<ViewBidBuyer />} />
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute
                roles={["buyer", "seller"]}
                component={<TransactionHistoryBuyer />}
              />
            }
          />
          <Route
            path="/transactions/view/:id"
            element={
              <ProtectedRoute
                roles={["buyer", "seller"]}
                component={<ViewTransaction />}
              />
            }
          />

          {/* Seller-only Routes */}
          <Route
            path="/rfq-seller"
            element={
              <ProtectedRoute
                roles={["seller"]}
                component={<SellerRFQForm />}
              />
            }
          />
          <Route
            path="/rfq-seller/view-rfq/:id"
            element={
              <ProtectedRoute
                roles={["seller"]}
                component={<ViewRFQSeller />}
              />
            }
          />
          <Route
            path="/bids"
            element={
              <ProtectedRoute
                roles={["seller"]}
                component={<SellerBidList />}
              />
            }
          />
          <Route
            path="/bids/single/:id"
            element={<ProtectedRoute roles={["seller"]} component={<Bid />} />}
          />
          <Route
            path="/bids/view-bid/:id"
            element={
              <ProtectedRoute roles={["seller"]} component={<ViewBid />} />
            }
          />
          <Route
            path="/bids/edit-bid/:id"
            element={
              <ProtectedRoute roles={["seller"]} component={<EditBid />} />
            }
          />

          {/* Routes for Both Buyer and Seller */}
          <Route
            path="/transactions/make"
            element={
              <ProtectedRoute
                roles={["buyer"]}
                component={<TransactionPage />}
              />
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute
                roles={["seller"]}
                component={<ProductDashboard />}
              />
            }
          />
          <Route
            path="/products/create-product"
            element={
              <ProtectedRoute roles={["seller"]} component={<ProductForm />} />
            }
          />

          <Route
            path="products/edit-product/:productId"
            element={
              <ProtectedRoute
                roles={["seller"]}
                component={<EditProductCard />}
              />
            }
          />
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default App;
