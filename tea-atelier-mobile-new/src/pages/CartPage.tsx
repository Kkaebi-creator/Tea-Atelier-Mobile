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
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/shop" /></IonButtons>
          <IonTitle>Cart ({itemCount})</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {isLoading && (
          <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
            <IonSpinner name="crescent" />
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="ion-padding ion-text-center">
            <IonText><p>Your cart is empty.</p></IonText>
            <IonButton routerLink="/shop">Continue Shopping</IonButton>
          </div>
        )}

        <IonList>
          {items.map((item) => (
            <IonItem key={item.product.id}>
              <IonThumbnail slot="start">
                <img src={item.product.image} alt={item.product.name} style={{ objectFit: "cover" }} />
              </IonThumbnail>
              <IonLabel>
                <h3>{item.product.name}</h3>
                <p>₱{item.product.price.toFixed(2)} × {item.quantity}</p>
                <p style={{ fontWeight: "bold" }}>₱{(item.product.price * item.quantity).toFixed(2)}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        {items.length > 0 && (
          <div className="ion-padding">
            <IonItem lines="none">
              <IonLabel><strong>Total</strong></IonLabel>
              <IonText slot="end"><strong>₱{total.toFixed(2)}</strong></IonText>
            </IonItem>
            <IonButton expand="block" onClick={() => navigate("/checkout")} style={{ marginTop: 8 }}>
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
