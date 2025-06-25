import React, { createContext, useContext, useState, ReactNode } from "react";

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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<Item[]>([]);
  const [selectedPages, setSelectedPages] = useState<Item[]>([]);
  const [basePackage, setBasePackage] = useState<BasePackage>({ description: "", price: 0 });

  return (
    <CartContext.Provider
      value={{ count, setCount, selectedExtras, setSelectedExtras, selectedPages, setSelectedPages, basePackage, setBasePackage }}
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
