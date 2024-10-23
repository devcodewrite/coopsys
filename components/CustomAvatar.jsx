import { Text } from "@rneui/themed";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

export default function CustomAvatar({
  size,
  rounded = false,
  source,
  style,
  containerStyle,
  title,
  titleStyle,
}) {
  return (
    <View
      style={[
        styles.container,
        size && { width: size, height: size },
        rounded && styles.rounded,
        containerStyle,
      ]}
    >
      {source?.uri ? (
        <Image
          source={source}
          style={[
            styles.image,
            size && { width: size, height: size },
            rounded && styles.rounded,
            style,
          ]}
          cachePolicy={"disk"}
        />
      ) : (
        <Text
          style={[styles.text, size && { fontSize: 0.5 * size }, titleStyle]}
        >
          {title}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rounded: {
    borderRadius: "100%",
  },
  image: {
    width: 40,
    height: 40,
  },
  text: {
    color: "#444",
    fontSize: .5*40,
    fontWeight: "600",
    textAlign: "center",
  },
  container: {
    backgroundColor: "#efefef",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
});
