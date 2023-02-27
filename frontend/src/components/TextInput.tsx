type TextInputProps = {
  placeholder?: string;
  value?: string;
  styles?: React.CSSProperties;
  type?: React.HTMLInputTypeAttribute;
};

export default function TextInput({ type = "text", ...TextInputProps }) {
  return (
    <>
      <input
        type={type}
        className="text-input heading-4"
        placeholder={TextInputProps.placeholder}
        style={{ ...TextInputProps.styles }}
      >
        {TextInputProps.value}
      </input>
    </>
  );
}
