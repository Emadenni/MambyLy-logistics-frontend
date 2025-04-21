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
  message: string;
  file: File | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface RegisterResult {
  success: boolean;
  message: string;
}

export interface AdminData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  profileImage?: string;
}

export interface FieldErrors {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
}

export interface Message {
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
  distance: number;
  type: string;
}
export interface AddAdminProps {
  open: boolean;
  onClose: () => void;
  onAddAdmin: () => void;
}
