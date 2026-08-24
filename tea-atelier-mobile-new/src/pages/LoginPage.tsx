import React, { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonText, IonSpinner,
  IonRouterLink,
} from "@ionic/react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [requiresTotp, setRequiresTotp] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, totpCode: totpCode || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      if (data.requiresTotp) { setRequiresTotp(true); return; }
      await login(data.token, data.user);
      navigate("/shop", { replace: true });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sign In</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>Tea Atelier</h2>

        {error && <IonText color="danger"><p>{error}</p></IonText>}

        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput
            type="email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
            placeholder="you@example.com"
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
            placeholder="••••••••"
          />
        </IonItem>

        {requiresTotp && (
          <IonItem>
            <IonLabel position="stacked">Authenticator Code</IonLabel>
            <IonInput
              type="text"
              value={totpCode}
              onIonChange={(e) => setTotpCode(e.detail.value!)}
              placeholder="6-digit code"
              maxlength={6}
            />
          </IonItem>
        )}

        <IonButton expand="block" onClick={handleSubmit} disabled={isLoading} style={{ marginTop: 16 }}>
          {isLoading ? <IonSpinner name="crescent" /> : "Sign In"}
        </IonButton>

        <p style={{ textAlign: "center", marginTop: 16 }}>
          Don't have an account?{" "}
          <IonRouterLink routerLink="/register">Register</IonRouterLink>
        </p>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
