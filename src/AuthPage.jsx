"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { useAuth } from "./AuthContext";
import { useTheme } from "./theme-provider";
import { Moon, Sun, Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }
      // Lógica de registro
      // Simularemos un registro exitoso
      alert("Registro exitoso. Por favor, inicia sesión.");
      setIsLogin(true);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else {
      // Lógica de inicio de sesión
      login({ email });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors">
      <Card className="w-[400px]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{isLogin ? "Iniciar sesión" : "Registrarse"}</CardTitle>
            <Button onClick={toggleTheme} variant="outline" size="icon">
              {theme === "light" ? (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          </div>
          <CardDescription>
            {isLogin
              ? "Ingresa tus credenciales para acceder"
              : "Crea una nueva cuenta"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  placeholder="correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="contraseña"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {!isLogin && (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    placeholder="confirmar contraseña"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <Button className="w-full mt-4" type="submit">
              {isLogin ? "Iniciar sesión" : "Registrarse"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-4 text-sm text-center">
            {isLogin ? "¿No tienes una cuenta? " : "¿Ya tienes una cuenta? "}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
              }}
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </CardFooter>
      </Card>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        Alan Gabriel Sastre Briceño
      </footer>
    </div>
  );
}
