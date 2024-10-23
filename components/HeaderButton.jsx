import { Button } from "@rneui/themed";

export default function HeaderButton({
  title,
  disabled,
  bolded = true,
  onPress,
  icon,
  type = "clear",
  buttonStyle,
}) {
  return (
    <Button
      disabled={disabled}
      type={type}
      buttonStyle={buttonStyle}
      titleStyle={{ fontWeight: bolded ? "bold" : "normal" }}
      title={title}
      icon={icon}
      onPress={onPress}
    />
  );
}
