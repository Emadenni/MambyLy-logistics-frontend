import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface Item {
  id: string;
  label: string;
  price: number;
}

interface BasePackage {
  description: string;
  price: number;
}

interface CartContextType {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  selectedExtras: Item[];
  setSelectedExtras: React.Dispatch<React.SetStateAction<Item[]>>;
  selectedPages: Item[];
  setSelectedPages: React.Dispatch<React.SetStateAction<Item[]>>;
  basePackage: BasePackage;
  setBasePackage: React.Dispatch<React.SetStateAction<BasePackage>>;
  resetCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "cartState";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Caricamento iniziale da localStorage con fallback valori di default
  const [selectedExtras, setSelectedExtras] = useState<Item[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.selectedExtras ?? [];
    } catch {
      return [];
    }
  });

  const [selectedPages, setSelectedPages] = useState<Item[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.selectedPages ?? [];
    } catch {
      return [];
    }
  });

  const [basePackage, setBasePackage] = useState<BasePackage>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return { description: "", price: 0 };
      const parsed = JSON.parse(saved);
      return parsed.basePackage ?? { description: "", price: 0 };
    } catch {
      return { description: "", price: 0 };
    }
  });

  // Calcola count dinamico: basePackage conta come 1 solo se prezzo > 0
  const [count, setCount] = useState(() => {
    const baseCount = basePackage.price > 0 ? 1 : 0;
    return baseCount + selectedExtras.length + selectedPages.length;
  });

  // Aggiorna count e salva tutto su localStorage quando cambia qualcosa
  useEffect(() => {
    const baseCount = basePackage.price > 0 ? 1 : 0;
    const newCount = baseCount + selectedExtras.length + selectedPages.length;
    setCount(newCount);

    const dataToSave = {
      selectedExtras,
      selectedPages,
      basePackage,
      count: newCount,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dataToSave));
  }, [selectedExtras, selectedPages, basePackage]);

  const resetCart = () => {
    setSelectedExtras([]);
    setSelectedPages([]);
    setBasePackage({ description: "", price: 0 });
    setCount(0);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  return (
    <CartContext.Provider
      value={{
        count,
        setCount,
        selectedExtras,
        setSelectedExtras,
        selectedPages,
        setSelectedPages,
        basePackage,
        setBasePackage,
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};  