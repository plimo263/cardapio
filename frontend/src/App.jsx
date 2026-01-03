import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/AdminLogin";
import Cardapio from "./pages/Cardapio";
import Usuarios from "./pages/Usuarios";
import ArquivosFront from "./pages/ArquivosFront";
import BebidasFront from "./pages/BebidasFront";
import CategoriasFront from "./pages/CategoriasFront";
import { Paper } from "@mui/material";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Paper elevation={0} sx={{ minHeight: "100vh", width: "100%" }}>
          <Routes>
            <Route path="/" element={<Cardapio />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute>
                  <Usuarios />
                </ProtectedRoute>
              }
            />
            <Route
              path="/arquivos_front"
              element={
                <ProtectedRoute>
                  <ArquivosFront />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bebidas_front"
              element={
                <ProtectedRoute>
                  <BebidasFront />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categorias_front"
              element={
                <ProtectedRoute>
                  <CategoriasFront />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Paper>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
