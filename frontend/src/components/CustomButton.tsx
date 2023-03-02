import "../styles/CustomButton.css";

type buttonTypes = "primary" | "secondary" | "tertiary" | "CTA";

interface CustomButtonProps {
  text?: string;
  type?: buttonTypes;
}

export default function CustomButton({
  type = "primary",
  ...CustomButtonProps
}: CustomButtonProps) {
  return (
    <button className={`custom-button-${type} button-text`}>
      {CustomButtonProps.text}
    </button>
  );
}
