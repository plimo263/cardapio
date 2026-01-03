import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  EmailOutlined,
  LocalCafe,
  Restaurant,
  LocalPizza,
  Cake,
  Icecream,
  Fastfood,
  LocalBar,
  Cookie,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const AdminLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Ícones flutuantes para o fundo
  const floatingIcons = [
    { Icon: LocalCafe, delay: 0, duration: 20 },
    { Icon: Restaurant, delay: 2, duration: 18 },
    { Icon: LocalPizza, delay: 4, duration: 22 },
    { Icon: Cake, delay: 1, duration: 19 },
    { Icon: Icecream, delay: 3, duration: 21 },
    { Icon: Fastfood, delay: 5, duration: 17 },
    { Icon: LocalBar, delay: 2.5, duration: 20 },
    { Icon: Cookie, delay: 4.5, duration: 19 },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // No backend, o campo é "username" mas vamos aceitar email
    const result = await login(formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      navigate("/usuarios");
    } else {
      setError(result.error || "Credenciais inválidas");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #A02A14 0%, #7A1F0F 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          right: "-50%",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          animation: "pulse 4s ease-in-out infinite",
        },
        "@keyframes pulse": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: 0.5,
          },
          "50%": {
            transform: "scale(1.1)",
            opacity: 0.8,
          },
        },
      }}
    >
      {/* Ícones flutuantes no lado direito da tela */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "50%",
          height: "100%",
          overflow: "hidden",
          zIndex: 0,
          opacity: 0.15,
          pointerEvents: "none",
          display: { xs: "none", md: "block" },
        }}
      >
        {floatingIcons.map((item, index) => {
          const { Icon, delay, duration } = item;
          return (
            <Box
              key={index}
              sx={{
                position: "absolute",
                left: `${(index * 12.5) % 100}%`,
                animation: `float ${duration}s ease-in-out ${delay}s infinite`,
                "@keyframes float": {
                  "0%, 100%": {
                    transform: "translateY(100vh) rotate(0deg)",
                  },
                  "50%": {
                    transform: "translateY(-20vh) rotate(180deg)",
                  },
                },
              }}
            >
              <Icon
                sx={{
                  fontSize: { xs: 60, sm: 80 },
                  color: "rgba(255, 255, 255, 0.6)",
                }}
              />
            </Box>
          );
        })}
      </Box>

      <Container maxWidth="lg">
        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            position: "relative",
            zIndex: 1,
            backdropFilter: "blur(10px)",
            background:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.background.paper, 0.95)
                : "rgba(255, 255, 255, 0.98)",
          }}
        >
          {/* Logo/Ícone */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #A02A14 0%, #C94D35 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                boxShadow: "0 4px 20px rgba(160, 42, 20, 0.3)",
              }}
            >
              <LockOutlined sx={{ fontSize: 40, color: "white" }} />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "#A02A14",
                textAlign: "center",
              }}
            >
              Área Administrativa
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center" }}
            >
              Faça login para acessar o painel
            </Typography>
          </Box>

          {/* Formulário */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 3, position: "relative", zIndex: 2 }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              variant="filled"
              label="Email"
              name="email"
              type="email"
              placeholder="exemplo@dominio.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              autoFocus
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              variant="filled"
              label="Senha"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "action.active" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #A02A14 0%, #C94D35 100%)",
                boxShadow: "0 4px 15px rgba(160, 42, 20, 0.4)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #7A1F0F 0%, #A02A14 100%)",
                  boxShadow: "0 6px 20px rgba(160, 42, 20, 0.5)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </Box>

          {/* Footer */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              textAlign: "center",
              mt: 3,
              position: "relative",
              zIndex: 2,
            }}
          >
            Acesso restrito a administradores
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;
