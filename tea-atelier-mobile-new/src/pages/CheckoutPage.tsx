import React, { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem,
  IonLabel, IonInput, IonButton, IonText, IonSpinner, IonRadioGroup,
  IonRadio, IonListHeader, IonButtons, IonBackButton,
} from "@ionic/react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { items, clearCart } = useCart();
  const [form, setForm] = useState({
    fullName: user?.name ?? "",
    phone: user?.phone ?? "",
    street: "",
    city: "",
    province: "",
    paymentMethod: "cod",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const set = (field: string) => (e: CustomEvent) =>
    setForm((prev) => ({ ...prev, [field]: e.detail.value! }));

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const deliveryFee = 99;
  const total = subtotal + deliveryFee;

  const handleSubmit = async () => {
    setError("");
    if (!form.street || !form.city || !form.province) {
      setError("All address fields are required.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          street: form.street,
          city: form.city,
          province: form.province,
          deliveryFee,
          paymentMethod: form.paymentMethod,
          phone: form.phone,
          fullName: form.fullName,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      await clearCart();
      navigate(`/order-confirmation/${data.orderId}`, { replace: true });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) return (
    <IonPage>
      <IonContent className="ion-padding ion-text-center">
        <IonText><p>Please sign in to checkout.</p></IonText>
        <IonButton routerLink="/login">Sign In</IonButton>
      </IonContent>
    </IonPage>
  );

  return (
    <IonPage className="tea-checkout-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/cart" /></IonButtons>
          <IonTitle>Checkout</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="tea-card-panel">
          {error && <IonText color="danger"><p>{error}</p></IonText>}

          <h3 style={{ margin: "0 0 12px", color: "#1d1b1a" }}>Delivery Address</h3>
          <IonItem>
            <IonLabel position="stacked">Full Name</IonLabel>
            <IonInput value={form.fullName} onIonChange={set("fullName")} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Phone</IonLabel>
            <IonInput type="tel" value={form.phone} onIonChange={set("phone")} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Street Address</IonLabel>
            <IonInput value={form.street} onIonChange={set("street")} placeholder="123 Mabini St." />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">City / Municipality</IonLabel>
            <IonInput value={form.city} onIonChange={set("city")} placeholder="Quezon City" />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Province</IonLabel>
            <IonInput value={form.province} onIonChange={set("province")} placeholder="Metro Manila" />
          </IonItem>

          <h3 style={{ margin: "18px 0 12px", color: "#1d1b1a" }}>Payment Method</h3>
          <IonRadioGroup value={form.paymentMethod} onIonChange={set("paymentMethod")}>
            <IonItem>
              <IonLabel>Cash on Delivery</IonLabel>
              <IonRadio slot="end" value="cod" />
            </IonItem>
            <IonItem>
              <IonLabel>GCash</IonLabel>
              <IonRadio slot="end" value="gcash" />
            </IonItem>
          </IonRadioGroup>
        </div>

        <div className="tea-card-panel" style={{ marginTop: 18 }}>
          <div className="tea-summary-row">
            <span>Subtotal</span><span className="tea-amount">₱{subtotal.toFixed(2)}</span>
          </div>
          <div className="tea-summary-row">
            <span>Delivery Fee</span><span className="tea-amount">₱{deliveryFee.toFixed(2)}</span>
          </div>
          <div className="tea-summary-row total">
            <span>Total</span><span className="tea-amount">₱{total.toFixed(2)}</span>
          </div>
        </div>

        <IonButton expand="block" onClick={handleSubmit} disabled={isLoading} style={{ marginTop: 18 }}>
          {isLoading ? <IonSpinner name="crescent" /> : "Place Order"}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default CheckoutPage;
