import { IconProps } from "@rneui/base";
import { Icon, ListItem, Text, useTheme } from "@rneui/themed";
import { PropsWithChildren } from "react";
import { RegisteredStyle, StyleProp, StyleSheet, View } from "react-native";

export function Label({
  data,
  icon,
  title,
  value,
  heading,
  containerStyle,
}: PropsWithChildren & {
  data: Array<{ title: string; value: string; icon: IconProps }>;
  icon: IconProps;
  title: string;
  value: string;
  heading: string;
  containerStyle: Object;
}) {
  const { theme } = useTheme();
  return (
    <View style={containerStyle}>
      {heading ? (
        <Text style={styles.heading} disabled>
          {heading}
        </Text>
      ) : null}
      <View style={styles.container}>
        {data ? (
          data.map(({ title, icon, value }, i) => (
            <ListItem
              key={i.toString()}
              containerStyle={styles.item}
              bottomDivider={i < data.length - 1}
            >
              {icon ? (
                <View style={{ width: 25 }}>
                  <Icon type={icon.type} name="" iconProps={icon} />
                </View>
              ) : null}
              <ListItem.Content style={styles.content}>
                <ListItem.Title style={styles.title}>{title}</ListItem.Title>
                <ListItem.Subtitle
                  style={[styles.subtitle, { color: theme.colors.primary }]}
                  selectable
                >
                  {value}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          ))
        ) : (
          <ListItem containerStyle={styles.item} bottomDivider>
            {icon ? (
              <View style={{ width: 16 }}>
                <Icon name="" iconProps={icon} />
              </View>
            ) : null}
            <ListItem.Content style={styles.content}>
              <ListItem.Title style={styles.title}>{title}</ListItem.Title>
              <ListItem.Subtitle
                style={[styles.subtitle, { color: theme.colors.primary }]}
              >
                {value || " "}
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingStart: 16,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    paddingHorizontal: 0,
  },
  content: {
    gap: 4,
  },
  title: {
    fontSize: 13,
  },
  subtitle: {
    fontSize: 16,
  },
  heading: {
    fontSize: 13,
    color: "gray",
    marginBottom: 4,
  },
});
