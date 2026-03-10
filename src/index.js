import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import Universities from "./pages/NavigationPages/Universities";
import Programs from "./pages/NavigationPages/Programs";
import Subjects from "./pages/NavigationPages/Subjects";

import AboutUs from "./pages/Footer Pages/AboutUs";
import ContactUs from "./pages/Footer Pages/ContactUs";
import PrivacyPolicy from "./pages/Footer Pages/PrivacyPolicy";
import TermsAndConditions from "./pages/Footer Pages/TermsAndConditions";
import CookiesPolicy from "./pages/Footer Pages/CookiesPolicy";

import Menubar from "./components/Navigation/Menubar";
import Footer from "./components/Navigation/Footer";

import Home from "./home/Home";
import UniReview from "./pages/ContentPages/UniReview";
import DetailView from "./pages/ContentPages/DetailView";
import ReviewDetail from "./pages/ContentPages/ReviewDetail";
import BlogDetail from "./pages/ContentPages/BlogDetail";
import QnADetail from "./pages/ContentPages/QnADetail";

import Add from "./pages/Footer Pages/AddContent";
import SearchPage from "./pages/SearchPage/searchPage";

import GoogleCallback from "./pages/LoginCallbackPages/GoogleCallback";
import FacebookCallback from "./pages/LoginCallbackPages/FacebookCallback";

import ThemedContentPage from "./themeList/ThemedContentPage";
import Destinations from "./pages/Destination Pages/Destinations";
import DestinationView from "./pages/Destination Pages/DestinationView";
import FacilityDetailPage from "./themeList/FacilityDetailPage";

import FeedbackModal from "./components/FeedbackModal/FeedbackModal";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdSenseLoader from "./ads/AdSenseLoader";
import PasswordGate from "./components/PasswordGate/PasswordGate";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PasswordGate>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
        <Menubar />
        <div className="flex-grow pt-[7vh]">
          <Routes>
            <Route index element={<Home />} />

            {/* Search */}
            <Route path="/search" element={<SearchPage />} />

            {/* Navigation pages */}
            <Route path="/universities" element={<Universities />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/subjects" element={<Subjects />} />

            {/* University detail & content details */}
            <Route
              path="/universities/:idUniversity/program/:idDetail"
              element={<DetailView />}
            />
            <Route
              path="/universities/:idUniversity/subject/:idDetail"
              element={<DetailView />}
            />
            <Route
              path="/universities/:idUniversity"
              element={<UniReview />}
            />

            {/* Post detail pages */}
            <Route path="/review/:id" element={<ReviewDetail />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/qna/:id" element={<QnADetail />} />

            {/* Static/footer pages */}
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiesPolicy />} />
            <Route path="/termsandconditions" element={<TermsAndConditions />} />
            <Route path="/add" element={<Add />} />

            {/* Social login callbacks */}
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/auth/facebook/callback" element={<FacebookCallback />} />

            {/* Themed content pages */}
            <Route path="/health" element={<ThemedContentPage title="Health" />} />
            <Route path="/fitness" element={<ThemedContentPage title="Fitness" />} />
            <Route path="/eateries" element={<ThemedContentPage title="Eateries" />} />
            <Route
              path="/culture-religion"
              element={<ThemedContentPage title="Culture & Religion" />}
            />
            <Route
              path="/clubs-societies"
              element={<ThemedContentPage title="Clubs & Societies" />}
            />
            <Route
              path="/accommodation"
              element={<ThemedContentPage title="Accommodation" />}
            />

            {/* Destinations */}
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destination/:idDestination" element={<DestinationView />} />

            {/* Facility detail */}
            <Route path="/facility/:facilityId" element={<FacilityDetailPage />} />
          </Routes>
        </div>

        <div className="mt-4">
          <Footer />
        </div>

        {/* Global UI */}
        <FeedbackModal />
        <ToastContainer />
        <AdSenseLoader />

      </div>
    </BrowserRouter>
    </PasswordGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
