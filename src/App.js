import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "./AuthContext";
import RegistroGastos from "./RegistroGastos";
import AuthPage from "./AuthPage";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<RegistroGastos />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
