import React, { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonText, IonSpinner,
  IonRouterLink,
} from "@ionic/react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phoneNumber: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const set = (field: string) => (e: CustomEvent) =>
    setForm((prev) => ({ ...prev, [field]: e.detail.value! }));

  const handleSubmit = async () => {
    setError("");
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      await login(data.token, data.user);
      navigate("/shop", { replace: true });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage className="tea-auth-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="auth-container">
          <h2 className="auth-title">Tea Atelier</h2>

          {error && <IonText className="error-text">{error}</IonText>}

          <div className="auth-form">
            <label className="field-label">Full Name</label>
            <IonItem className="soft-field">
              <IonInput value={form.firstName} onIonChange={set("firstName")} placeholder="Your name" />
            </IonItem>

            <label className="field-label">Email</label>
            <IonItem className="soft-field">
              <IonInput type="email" value={form.email} onIonChange={set("email")} placeholder="you@example.com" />
            </IonItem>

            <label className="field-label">Password</label>
            <IonItem className="soft-field">
              <IonInput type="password" value={form.password} onIonChange={set("password")} placeholder="Create a password" />
            </IonItem>

            <IonButton className="auth-button" expand="block" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? <IonSpinner name="crescent" /> : "Create Account"}
            </IonButton>

            <p className="auth-link">
              Already have an account? <IonRouterLink routerLink="/login">Sign In</IonRouterLink>
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
