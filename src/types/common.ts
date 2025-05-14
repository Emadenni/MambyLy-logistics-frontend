import { ReactNode } from "react";

export interface CTAProps {
  text: string;
  backgroundColor?: string;
  color?: string;
  hoverBackgroundColor?: string;
  hoverColor?: string;
  onClick?: () => void;
  className?: string;
}

export type logoProps = {
  size?: "small" | "medium" | "large";
};

export interface ServicesCardProps {
  title: string;
  shortDescription: string;
  background_color: string;
  color: string;
  path: string;
  id: string;
  children?: React.ReactNode;
}

export interface MicroserviceCardProps {
  title: string;
  description: string;
  type: "transport" | "digital" | "other";
  id: string;
  image?: string;
  onSelect: () => void;
}

export interface FormData {
  name: string;
  email: string;
  message: string;
  subject: string;
  file: File | null;
  termsAccepted: boolean;
}

export interface FormProps {
  subjectFromCard: string;
  isJobApplication?: boolean;
}

export interface Position {
  id: string;
  departure: string;
  destination: string;
  distance: string;
  serviceType: string;
}

export interface AvailablePositionTableProps {
  onSelectJob: (jobId: string) => void;
}

export interface TeamMember {
  name: string;
  role: string;
  email: string;
  imageUrl: string;
}

export interface Admin {
  createdAt?: string; // Obbligatorio
  adminId: string;
  email: string;
  profileImageUrl?: any;
  firstName: string;
  lastName: string;
  profilePicture?: string; 
  role: string;
}

interface AdminInfoBoxProps {
  admin: Admin;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  token?: string;
  adminIdts?: string;  // O il tipo corretto per adminIdts
  data?: T; 
}


export interface RegisterResult {
  success: boolean;
  message: string;
}

export interface AdminData {
  id: string;
  profileImageUrl?:any;
  role: string;
  createdAt?: any;
  adminId: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  profileImage?: string;
  profilePicture?: string;

}


export interface FieldErrors {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
}

export interface Message {
  clientMessageId: string;
  jobMessageId: string;
  name: string;
  email: string;
  subject: string;
  textMessage: string;
  sentAt: string;
  uploadCv?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  adminId: string | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setAdminId: (adminId: string | null) => void;
  logout: () => void;
  handleUnauthorized: () => void;
}

export interface JobPosition {
  positionId: string;
  createdAt: string;
  departure: string;
  destination: string;
 distance: number | string;
  type: string;
}

export interface AddAdminProps {
  open: boolean;
  onClose: () => void;
  onAddAdmin: () => void;
}

export type NewAdminData = {
  createdAt: any;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: string;
};
