import React, { useEffect, useState, createContext } from "react";
import { fetchProducts } from "./services/api";

const Store = createContext();
const { Provider: ContextProvider, Consumer } = Store;

const INITIAL_CART = [
  {
    id: 43900,
    name: "Duracell - AAA Batteries (4-Pack)",
    price: 5.49,
    quantity: 1,
  },
];

function Provider({ children }) {
  const [cart, setCart] = useState(INITIAL_CART);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((response) => {
      setProducts(response);
      setLoading(false);
    });
    return () => {
      setLoading(true);
      setProducts([]);
    };
  }, []);

  const addProduct = (productId) => {
    // verificar se já está no carrinho
    const foundProd = cart.find((prod) => prod.id === productId);
    // se sim, adiciona à quantidade
    if (foundProd) {
      foundProd.quantity += 1;
      const newCart = cart.map((prod) =>
        prod.id === foundProd.id ? foundProd : prod
      );
      setCart(newCart);
    } else {
      const { name, id, price } = products.find(
        (prod) => prod.id === productId
      );
      const newProd = {
        id,
        name,
        price,
        quantity: 1,
      };
      // se não, adiciona o produto no array com qtd = 1
      setCart([...cart, newProd]);
    }
  };

  const removeProduct = (productId) => {
    console.log("Crick!", productId);
    const foundProd = cart.find((prod) => prod.id === productId);
    if (foundProd.quantity === 1) {
      const newCart = cart.filter((prod) => prod.id !== foundProd.id);
      setCart(newCart);
    } else {
      foundProd.quantity -= 1;
      const newCart = cart.map((prod) =>
        prod.id === foundProd.id ? foundProd : prod
      );
      setCart(newCart);
    }
  };

  const cartContext = {
    cart,
    products,
    loading,
    addProduct,
    removeProduct,
  };

  return <ContextProvider value={cartContext}>{children}</ContextProvider>;
}

export { Provider, Consumer, Store };
