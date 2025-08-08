import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios.js";
import PageLoader from "./components/PageLoader.jsx";
import Layout from "./components/Layout.jsx";
import useThemeStore from "./store/useThemeStore.js";

export default function App() {
  //zustand
  const { theme } = useThemeStore();
  //axios
  //tanstack query explain
  const {
    data: authData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["authUser"],

    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false,
  });

  const authUser = authData?.user ?? null;

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;
  // if (error) return <Navigate to="/login" />;
  // console.log(authUser);

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/call"
          element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              isOnboarded ? (
                <Navigate to="/" />
              ) : (
                <OnboardingPage />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
}
