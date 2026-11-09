import React from "react";
import {
  LuAxe,
  LuBedDouble,
  LuBuilding2,
  LuBus,
  LuClock,
  LuCoffee,
  LuDoorOpen,
  LuFlame,
  LuInfo,
  LuKey,
  LuLogOut,
  LuRecycle,
  LuSailboat,
  LuShoppingBag,
  LuSquareParking,
  LuThermometer,
  LuTriangleAlert,
  LuUtensils,
  LuVolumeX,
  LuWashingMachine,
  LuWaves,
  LuWifi,
} from "react-icons/lu";
import type { IconName } from "./types";

/** The line icons of the house's sections (no emoji anywhere on the page). */
const ICONS: Record<IconName, React.ComponentType<{ "aria-hidden"?: boolean }>> = {
  key: LuKey,
  wifi: LuWifi,
  clock: LuClock,
  sauna: LuThermometer,
  fire: LuFlame,
  wood: LuAxe,
  swim: LuWaves,
  canoe: LuSailboat,
  recycle: LuRecycle,
  parking: LuSquareParking,
  door: LuDoorOpen,
  building: LuBuilding2,
  laundry: LuWashingMachine,
  bus: LuBus,
  coffee: LuCoffee,
  quiet: LuVolumeX,
  shop: LuShoppingBag,
  alert: LuTriangleAlert,
  checkout: LuLogOut,
  info: LuInfo,
  kitchen: LuUtensils,
  bed: LuBedDouble,
};

export const StayIcon: React.FC<{ name: IconName }> = ({ name }) => {
  const Icon = ICONS[name] ?? LuInfo;
  return <Icon aria-hidden />;
};
