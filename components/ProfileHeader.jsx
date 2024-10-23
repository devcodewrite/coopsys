// components/ProfileHeader.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@rneui/themed";
import CustomAvatar from "./CustomAvatar";

const ProfileHeader = ({ name, email, avatarUrl }) => {
  return (
    <View style={styles.headerContainer}>
      <CustomAvatar
        size={100}
        rounded
        source={{
          uri: avatarUrl || null,
        }}
        containerStyle={styles.avatar}
      />
      <View>
        <Text h4>{name || "John Doe"}</Text>
        <Text>{email || "john.doe@example.com"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  avatar: {
    marginRight: 15,
  },
});

export default ProfileHeader;
