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
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {error && <IonText color="danger"><p>{error}</p></IonText>}

        <IonItem>
          <IonLabel position="stacked">First Name</IonLabel>
          <IonInput value={form.firstName} onIonChange={set("firstName")} placeholder="Juan" />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Last Name</IonLabel>
          <IonInput value={form.lastName} onIonChange={set("lastName")} placeholder="Dela Cruz" />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput type="email" value={form.email} onIonChange={set("email")} placeholder="you@example.com" />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Phone (optional)</IonLabel>
          <IonInput type="tel" value={form.phoneNumber} onIonChange={set("phoneNumber")} placeholder="+63 9XX XXX XXXX" />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput type="password" value={form.password} onIonChange={set("password")} placeholder="Min. 8 characters" />
        </IonItem>

        <IonButton expand="block" onClick={handleSubmit} disabled={isLoading} style={{ marginTop: 16 }}>
          {isLoading ? <IonSpinner name="crescent" /> : "Create Account"}
        </IonButton>

        <p style={{ textAlign: "center", marginTop: 16 }}>
          Already have an account?{" "}
          <IonRouterLink routerLink="/login">Sign In</IonRouterLink>
        </p>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
