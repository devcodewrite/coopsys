import { Avatar, Icon, ListItem, Text } from "@rneui/themed";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomAvatar from "./CustomAvatar";
import moment from "moment";

export default function ProfileListItem({
  name,
  given_name = "",
  family_name = "",
  url,
  dateJoined = null,
  num,
  onPress,
  isSynced = true,
}) {
  return (
    <TouchableOpacity activeOpacity={.7} onPress={onPress}>
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
          {dateJoined && (
            <Text style={styles.date}>
              {moment(dateJoined).format("D/M/Y")}
            </Text>
          )}
          <ListItem.Subtitle>
            {num}
          </ListItem.Subtitle>
        </ListItem.Content>
        {isSynced ? null : (
          <View style={styles.icon}>
            <Icon type="fontawesome" name="cloud-upload" size={20} />
          </View>
        )}
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
  icon: {
    position: "absolute",
    end: 16,
    top: 16,
  },
});
