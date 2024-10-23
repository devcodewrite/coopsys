// components/SettingOption.js
import React, { PropsWithChildren } from "react";
import { TouchableOpacity } from "react-native";
import { ListItem, Icon } from "@rneui/themed";

const SettingOption = ({
  title,
  icon,
  value,
  onPress,
}: PropsWithChildren & {
  title: string;
  icon: string;
  value?: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ListItem bottomDivider>
        <Icon name={icon} size={24} />
        <ListItem.Content
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <ListItem.Title>{title}</ListItem.Title>
          <ListItem.Title numberOfLines={1} style={{ maxWidth: "50%" }}>
            {value}
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </TouchableOpacity>
  );
};

export default SettingOption;
