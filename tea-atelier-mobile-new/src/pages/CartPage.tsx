import React from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList,
  IonItem, IonLabel, IonButton, IonText, IonThumbnail, IonButtons,
  IonBackButton, IonSpinner,
} from "@ionic/react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const CartPage: React.FC = () => {
  const { items, itemCount, isLoading, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (!token) return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/shop" /></IonButtons>
          <IonTitle>Cart</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding ion-text-center">
        <IonText><p>Please sign in to view your cart.</p></IonText>
        <IonButton routerLink="/login">Sign In</IonButton>
      </IonContent>
    </IonPage>
  );

  return (
    <IonPage className="tea-cart-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/shop" /></IonButtons>
          <IonTitle>Your Cart</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="tea-card-panel">
          {isLoading && (
            <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
              <IonSpinner name="crescent" />
            </div>
          )}

          {!isLoading && items.length === 0 && (
            <div className="ion-text-center">
              <IonText><p>Your cart is empty.</p></IonText>
              <IonButton routerLink="/shop">Continue Shopping</IonButton>
            </div>
          )}

          {items.map((item) => (
            <div className="tea-item-row" key={item.product.id}>
              <img src={item.product.image} alt={item.product.name} className="tea-item-thumb" />
              <div className="tea-item-copy">
                <p className="tea-item-name">{item.product.name}</p>
                <p className="tea-item-sub">₱{item.product.price.toFixed(2)} × {item.quantity}</p>
              </div>
              <span className="tea-qty-chip">{item.quantity}</span>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="tea-card-panel" style={{ marginTop: 18 }}>
            <div className="tea-summary-box">
              <div className="tea-summary-row">
                <span>Subtotal</span>
                <span className="tea-amount">₱{total.toFixed(2)}</span>
              </div>
              <div className="tea-summary-row total">
                <span>Total</span>
                <span className="tea-amount">₱{total.toFixed(2)}</span>
              </div>
            </div>
            <IonButton expand="block" onClick={() => navigate("/checkout")} style={{ marginTop: 16 }}>
              Proceed to Checkout
            </IonButton>
            <IonButton expand="block" fill="outline" color="danger" onClick={clearCart} style={{ marginTop: 8 }}>
              Clear Cart
            </IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default CartPage;
