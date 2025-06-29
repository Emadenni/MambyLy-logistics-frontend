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
  resetCart: (keepBase?: boolean) => void;
  stepTwoData?: StepTwoState;
  setStepTwoData?: (data: StepTwoState) => void;
  wasReset: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = "cartState";

export const DEFAULT_BASE_PACKAGE: BasePackage = {
  description: "Bas paket med SEO, mobilanpassning, support mm.",
  price: 1990,
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [selectedExtras, setSelectedExtras] = useState<Item[]>([]);
  const [selectedPages, setSelectedPages] = useState<Item[]>([]);
  const [basePackage, setBasePackage] = useState<BasePackage>(DEFAULT_BASE_PACKAGE);
  const [stepTwoData, setStepTwoDataState] = useState<StepTwoState | undefined>(undefined);
  const [wasReset, setWasReset] = useState(false);

  const count =
    (basePackage.price > 0 ? 1 : 0) +
    selectedExtras.length +
    selectedPages.length;

  useEffect(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedExtras(parsed.selectedExtras ?? []);
        setSelectedPages(parsed.selectedPages ?? []);
        setBasePackage(parsed.basePackage ?? DEFAULT_BASE_PACKAGE);
        setStepTwoDataState(parsed.stepTwoData ?? undefined);
      } catch (e) {
        console.error("Errore parsing cartState", e);
      }
    }
  }, []);

  useEffect(() => {
    const shouldHaveBase =
      selectedExtras.length > 0 || selectedPages.length > 0;
    const baseIsEmpty =
      basePackage.price === 0 || basePackage.description === "";

    if (shouldHaveBase && baseIsEmpty) {
      setBasePackage(DEFAULT_BASE_PACKAGE);
    }

    const dataToSave = {
      selectedExtras,
      selectedPages,
      basePackage,
      stepTwoData,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dataToSave));
  }, [selectedExtras, selectedPages, basePackage, stepTwoData]);

  const setStepTwoData = (data: StepTwoState) => {
    setStepTwoDataState(data);
  };

  const resetCart = (keepBase: boolean = true) => {
    const emptyStepTwoData: StepTwoState = {
      contentSentViaDemo: false,
      selectedExtras: [],
      sectionsNoteText: "",
      noSectionChanges: false,
      selectedPageOptionIds: [],
      staticPageDescription: "",
      noExtraPageNeeded: false,
    };

    setSelectedExtras([]);
    setSelectedPages([]);
    setBasePackage(keepBase ? DEFAULT_BASE_PACKAGE : { description: "", price: 0 });
    setStepTwoDataState(emptyStepTwoData);

    const dataToSave = {
      selectedExtras: [],
      selectedPages: [],
      basePackage: keepBase ? DEFAULT_BASE_PACKAGE : { description: "", price: 0 },
      stepTwoData: emptyStepTwoData,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dataToSave));
    localStorage.removeItem("stepTwoSelections");

    setWasReset(true);
    setTimeout(() => setWasReset(false), 500);
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
        wasReset,
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
