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
