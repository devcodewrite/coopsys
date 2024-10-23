import { ListItem } from "@rneui/themed";
import { TouchableOpacity } from "react-native";

export default function CustomListItem({ title, subtitle, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{title}</ListItem.Title>
          <ListItem.Subtitle>{subtitle}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );
}