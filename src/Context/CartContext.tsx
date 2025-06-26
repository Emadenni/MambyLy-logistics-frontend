import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { StepTwoState } from "../components/Steps/StepTwo";

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
  selectedExtras: Item[];
  setSelectedExtras: React.Dispatch<React.SetStateAction<Item[]>>;
  selectedPages: Item[];
  setSelectedPages: React.Dispatch<React.SetStateAction<Item[]>>;
  basePackage: BasePackage;
  setBasePackage: React.Dispatch<React.SetStateAction<BasePackage>>;
  resetCart: () => void;
  stepTwoData?: StepTwoState;
  setStepTwoData?: (data: StepTwoState) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = "cartState";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [selectedExtras, setSelectedExtras] = useState<Item[]>([]);
  const [selectedPages, setSelectedPages] = useState<Item[]>([]);
  const [basePackage, setBasePackage] = useState<BasePackage>({
    description: "",
    price: 0,
  });
  const [stepTwoData, setStepTwoDataState] = useState<StepTwoState | undefined>(undefined);
  const [count, setCount] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSelectedExtras(parsed.selectedExtras ?? []);
        setSelectedPages(parsed.selectedPages ?? []);
        setBasePackage(parsed.basePackage ?? { description: "", price: 0 });
        setStepTwoDataState(parsed.stepTwoData ?? undefined);
      }
    } catch {
      // fallback silenzioso
    }
  }, []);

  useEffect(() => {
    const baseCount = basePackage.price > 0 ? 1 : 0;
    const newCount = baseCount + selectedExtras.length + selectedPages.length;
    setCount(newCount);

    const dataToSave = {
      selectedExtras,
      selectedPages,
      basePackage,
      stepTwoData,
      count: newCount,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dataToSave));
  }, [selectedExtras, selectedPages, basePackage, stepTwoData]);

  const setStepTwoData = (data: StepTwoState) => {
    setStepTwoDataState(data);
  };

  const resetCart = () => {
    setSelectedExtras([]);
    setSelectedPages([]);
    setBasePackage({ description: "", price: 0 });
    setStepTwoDataState(undefined);
    setCount(0);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  return (
    <CartContext.Provider
      value={{
        count,
        selectedExtras,
        setSelectedExtras,
        selectedPages,
        setSelectedPages,
        basePackage,
        setBasePackage,
        resetCart,
        stepTwoData,
        setStepTwoData,
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
