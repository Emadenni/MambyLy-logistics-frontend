export interface CTAProps {
  text: string;
  backgroundColor?: string;
  color?: string;
  hoverBackgroundColor?: string;
  hoverColor?: string;
  onClick?: () => void;
}

export type logoProps = {
  size?: "small" | "medium" | "large";
};

export interface ServicesCardProps {
  title: string;
  shortDescription: string;
  image: string;
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

interface Admin {
  firstName: string;
  lastName: string;
  profilePicture: string;
  role: string;  
}

interface AdminInfoBoxProps {
  admin: Admin;
}

export interface FormData {
  name: string;
  email: string;
  subject: string;
  textMessage: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;  
}

interface RegisterResult {
  success: boolean;
  message: string;
}

interface AdminData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImage: string;
}

interface FieldErrors {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
}

interface Message {
  messageId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  sentAt: string;
}