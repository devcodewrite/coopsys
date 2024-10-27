import { Icon, ListItem } from "@rneui/themed";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function CustomListItem({
  title,
  subtitle,
  onPress,
  isSynced = true,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{title}</ListItem.Title>
          <ListItem.Subtitle>{subtitle}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
      {isSynced ? null : (
        <View style={styles.icon}>
          <Icon type="fontawesome" name="cloud-upload" size={20} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icon: {
    position: "absolute",
    end: 16,
    top: 16,
  },
});
