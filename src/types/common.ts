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
  color:string;
  onClick: () => void;
  id: string;
}

export interface MicroserviceCardProps {
  title: string;
  description: string;
  type: "transport" | "digital" | "other"; 
  id: string;
  image?: string; 
}
