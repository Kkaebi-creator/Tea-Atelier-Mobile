import React, { useState, useEffect } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList,
  IonItem, IonLabel, IonButton, IonSpinner, IonText, IonIcon, IonBadge,
} from "@ionic/react";
import { checkmarkCircle } from "ionicons/icons";
import { useParams } from "react-router-dom";
import { API_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";

type OrderDetail = {
  orderId: number;
  recipientName: string;
  orderStatus: string;
  paymentMethod: string;
  createdAt: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  items: { productId: number; name: string; image: string; quantity: number; price: number }[];
};

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { token } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setOrder(await res.json());
      setIsLoading(false);
    })();
  }, [orderId]);

  if (isLoading) return (
    <IonPage>
      <IonContent className="ion-padding ion-text-center">
        <IonSpinner name="crescent" />
      </IonContent>
    </IonPage>
  );

  if (!order) return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonText color="danger"><p>Order not found.</p></IonText>
      </IonContent>
    </IonPage>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Order Confirmed</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <IonIcon icon={checkmarkCircle} style={{ fontSize: 64, color: "#5a7a52" }} />
          <h2>Thank you, {order.recipientName}!</h2>
          <p style={{ color: "#888" }}>Order #{order.orderId}</p>
          <IonBadge color="success">{order.orderStatus}</IonBadge>
        </div>

        <h3>Order Summary</h3>
        <IonList>
          {order.items.map((item) => (
            <IonItem key={item.productId}>
              <IonLabel>
                <h3>{item.name}</h3>
                <p>₱{item.price.toFixed(2)} × {item.quantity}</p>
              </IonLabel>
              <IonText slot="end">₱{(item.price * item.quantity).toFixed(2)}</IonText>
            </IonItem>
          ))}
        </IonList>

        <div style={{ padding: 12, background: "#f5f5f5", borderRadius: 8, marginTop: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Subtotal</span><span>₱{order.subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Delivery</span><span>₱{order.deliveryFee.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginTop: 8 }}>
            <span>Total</span><span>₱{order.total.toFixed(2)}</span>
          </div>
        </div>

        <p style={{ color: "#888", fontSize: 13, marginTop: 8 }}>
          Payment: {order.paymentMethod.toUpperCase()} &bull;{" "}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>

        <IonButton expand="block" routerLink="/shop" style={{ marginTop: 24 }}>
          Continue Shopping
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default OrderConfirmationPage;
