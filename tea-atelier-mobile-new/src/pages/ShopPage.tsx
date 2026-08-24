import React, { useState, useEffect } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonButton, IonSpinner, IonText, IonBadge, IonButtons,
  IonIcon,
} from "@ionic/react";
import { cartOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  availability: string;
  stockQuantity: number;
};

const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        if (res.ok) setProducts(data.products);
        else setError("Failed to load products.");
      } catch {
        setError("Network error.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tea Atelier</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/cart" style={{ position: "relative" }}>
              <IonIcon icon={cartOutline} />
              {itemCount > 0 && (
                <IonBadge color="danger" style={{ position: "absolute", top: 4, right: 4, fontSize: 10 }}>
                  {itemCount}
                </IonBadge>
              )}
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={search}
            onIonInput={(e) => setSearch(e.detail.value!)}
            placeholder="Search products..."
          />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {isLoading && (
          <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
            <IonSpinner name="crescent" />
          </div>
        )}
        {error && <IonText color="danger"><p className="ion-padding">{error}</p></IonText>}

        <IonGrid>
          <IonRow>
            {filtered.map((product) => (
              <IonCol size="6" key={product.id}>
                <IonCard
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{ cursor: "pointer", height: "100%" }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "100%", height: 140, objectFit: "cover" }}
                  />
                  <IonCardHeader>
                    <IonCardTitle style={{ fontSize: 14 }}>{product.name}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p style={{ fontWeight: "bold", margin: 0 }}>₱{product.price.toFixed(2)}</p>
                    <p style={{ fontSize: 12, color: product.availability === "In Stock" ? "green" : "red", margin: 0 }}>
                      {product.availability}
                    </p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {!isLoading && filtered.length === 0 && (
          <IonText><p className="ion-padding ion-text-center">No products found.</p></IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ShopPage;
