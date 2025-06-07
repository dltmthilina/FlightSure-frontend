import { Input, InputProps, Typography } from "antd";

const { Text } = Typography;

interface CommonInputProps extends InputProps {
  label?: string;
  helperText?: string;
}

const CommonTextInput = ({
  label,
  helperText,
  ...inputProps
}: CommonInputProps) => {
  return (
    <div className="flex flex-col">
      {label && <Text>{label}</Text>}
      <Input {...inputProps} />
      {helperText && <Text type="danger">{helperText}</Text>}
    </div>
  );
};

export default CommonTextInput;
