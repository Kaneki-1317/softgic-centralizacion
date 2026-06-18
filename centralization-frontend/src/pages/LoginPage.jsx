import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const navigate =
    useNavigate();

  const { login } =
    useAuth();

  const { showToast } =
    useToast();

  const [email, setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e
  ) {
    e.preventDefault();

    const success =
      await login(
        email,
        password
      );

    if (success) {
      showToast("Sesión iniciada correctamente", "success");
      navigate("/admin");
      return;
    }

    showToast("Credenciales inválidas", "error");
    setError(
      "Credenciales inválidas"
    );
  }

  return (
    <main className="login-page">

      <form
        className="login-card"
        onSubmit={
          handleSubmit
        }
      >
        <h1>
          Iniciar Sesión
        </h1>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <button
          className="primary-button"
          type="submit"
        >
          Ingresar
        </button>

      </form>

    </main>
  );
}