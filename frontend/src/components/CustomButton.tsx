import { Props } from "../App";
import "../styles/CustomButton.css";

type buttonTypes = "primary" | "secondary" | "tertiary" | "CTA";

interface CustomButtonProps extends Props {
  text?: string;
  type?: buttonTypes;
}

export default function CustomButton({
  type = "primary",
  ...CustomButtonProps
}: CustomButtonProps) {
  return (
    <button
      className={`custom-button-${type} button-text ${CustomButtonProps.className}`}
      style={CustomButtonProps.style}
    >
      {CustomButtonProps.text}
    </button>
  );
}
