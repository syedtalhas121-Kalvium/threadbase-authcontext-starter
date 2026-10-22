import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../services/apiClient.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useAuth();

  const loginMutation = useMutation({
    mutationFn: (credentials) =>
      apiClient.post("/auth/login", credentials).then((res) => res.data),
    onSuccess: (data) => {
      dispatch({
        type: "LOGIN",
        payload: { user: data.user, accessToken: data.accessToken },
      });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h2>Log in</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="ada@threadbase.dev"
        autoComplete="email"
        required
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="password"
        autoComplete="current-password"
        required
      />
      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging in…" : "Log in"}
      </button>
      {loginMutation.isError && (
        <p role="alert">Login failed. Check your email and password, then try again.</p>
      )}
    </form>
  );
}
