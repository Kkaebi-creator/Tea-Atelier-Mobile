import React, { useState, useEffect } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonButton, IonSpinner, IonText, IonBadge, IonButtons,
  IonIcon, IonPopover, IonList, IonItem, IonLabel,
} from "@ionic/react";
import { cartOutline, menuOutline, logOutOutline } from "ionicons/icons";
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
  const [showPopover, setShowPopover] = useState(false);

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

  const handleLogout = async () => {
    await logout();
    setShowPopover(false);
    navigate("/login", { replace: true });
  };

  return (
    <IonPage className="tea-shop-page">
      <IonHeader className="shop-header">
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
            <IonButton id="menu-button">
              <IonIcon icon={menuOutline} />
            </IonButton>
            <IonPopover trigger="menu-button" side="end" alignment="end">
              <IonContent className="ion-padding">
                <IonList>
                  {user && (
                    <IonItem>
                      <IonLabel>
                        <p>{user.firstName} {user.lastName}</p>
                        <p style={{ fontSize: "0.8rem", color: "var(--tea-text-soft)" }}>{user.email}</p>
                      </IonLabel>
                    </IonItem>
                  )}
                  <IonItem button onClick={handleLogout}>
                    <IonIcon icon={logOutOutline} slot="start" style={{ color: "var(--tea-red)" }} />
                    <IonLabel style={{ color: "var(--tea-red)" }}>Sign Out</IonLabel>
                  </IonItem>
                </IonList>
              </IonContent>
            </IonPopover>
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
        <div className="shop-inner">
          {isLoading && (
            <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
              <IonSpinner name="crescent" />
            </div>
          )}
          {error && <IonText color="danger"><p className="ion-padding">{error}</p></IonText>}

          <IonGrid className="product-grid">
            <IonRow>
              {filtered.map((product) => (
                <IonCol size="6" key={product.id}>
                  <IonCard
                    className="tea-product-card"
                    onClick={() => navigate(`/product/${product.id}`)}
                    style={{ cursor: "pointer", height: "100%" }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="tea-product-image"
                    />
                    <div className="tea-product-body">
                      <p className="tea-product-name">{product.name}</p>
                      <div className="tea-product-meta">
                        <span className="tea-product-price">₱{product.price.toFixed(2)}</span>
                        <span className={`tea-product-stock ${product.availability === "In Stock" ? "" : "out"}`}>
                          {product.availability}
                        </span>
                      </div>
                      <IonButton className="tea-product-cta" expand="block" size="small" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.id}`);
                      }}>
                        View
                      </IonButton>
                    </div>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>

          {!isLoading && filtered.length === 0 && (
            <IonText><p className="ion-padding ion-text-center">No products found.</p></IonText>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ShopPage;
