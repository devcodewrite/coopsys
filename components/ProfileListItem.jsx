import { Avatar, ListItem, Text } from "@rneui/themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import CustomAvatar from "./CustomAvatar";

export default function ProfileListItem({
  name,
  group,
  given_name = "",
  family_name = "",
  url,
  dateJoined,
  passbook,
  onPress,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ListItem bottomDivider>
        <CustomAvatar
          rounded
          source={{ uri: url }}
          title={
            url
              ? null
              : given_name.substring(0, 1) + family_name.substring(0, 1)
          }
        />
        <ListItem.Content>
          <ListItem.Title>{name}</ListItem.Title>
          {dateJoined && <Text style={styles.date}>{dateJoined}</Text>}
          <ListItem.Subtitle>
            {group} | #{passbook}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  date: {
    position: "absolute",
    end: 0,
    fontSize: 12,
  },
});
