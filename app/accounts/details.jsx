import React, { useEffect, useRef, useState } from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";

import HeaderButton from "@/components/HeaderButton";
import { useRouteInfo } from "expo-router/build/hooks";
import { Button, Text, useTheme } from "@rneui/themed";
import CustomAvatar from "@/components/CustomAvatar";
import { Label } from "@/components/Label";
import { useActivityResult } from "@/hooks/useNavigateForResult";
import moment from "moment";

const titleOptions = [
  { label: "Mr.", value: "mr" },
  { label: "Mrs.", value: "mrs" },
  { label: "Miss", value: "miss" },
  { label: "Dr.", value: "dr" },
  { label: "Prof.", value: "prof" },
];
const DetailsLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRouteInfo();
  const { theme } = useTheme();

  const { setCallback } = useActivityResult();
  const syncManager = useRef(null);
  const [data, setData] = useState(route.params);
  const [index, setIndex] = React.useState(0);

  const title = titleOptions.reduce(
    (title, { label, value }) => (value === data.title ? label : title),
    ""
  );

  useEffect(() => {
    navigation.setOptions({
      title: data.name,
      headerRight: () => (
        <HeaderButton
          title={"Edit"}
          onPress={() => navigation.navigate("accounts/edit")}
        />
      ),
    });
  }, [navigation]);

  const handleCall =  () => {
    Linking.openURL(`tel:${data.primary_phone}`).catch((e) => {
      console.log(e);
    });
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.topContainer}>
        <CustomAvatar
          rounded
          size={150}
          source={{ uri: data.photo }}
          title={
            data.photo
              ? null
              : data.given_name.substring(0, 1) +
                data.family_name.substring(0, 1)
          }
        />
        <View style={styles.subContainer}>
          <Text style={styles.title}>
            {title} {data.given_name} {data.family_name}
          </Text>
          <Text style={styles.subtitle}>A.K.A {data.name}</Text>
          <Text style={styles.num} selectable>
            {data.acnum}
          </Text>
        </View>
        <View style={styles.actions}>
          <Button
            title={"call"}
            role="contentinfo"
            icon={{ name: "phone", color: theme.colors.primary, size: 28 }}
            buttonStyle={styles.actionButton}
            type="clear"
            titleStyle={styles.actionTitle}
            onPress={handleCall}
          />
          <Button
            title={"mail"}
            icon={{ name: "email", color: theme.colors.primary, size: 28 }}
            buttonStyle={styles.actionButton}
            type="clear"
            titleStyle={styles.actionTitle}
            onPress={() => Linking.openURL(`mailto:${data.email}`)}
          />
          <Button
            title={"passbook"}
            type="clear"
            titleStyle={styles.actionTitle}
            icon={{
              name: "address-book",
              type: "font-awesome",
              color: theme.colors.primary,
              size: 28,
            }}
            buttonStyle={styles.actionButton}
          />
        </View>

        <View style={styles.dateView}>
          <Text style={styles.date}>Joined: </Text>
          <Text style={styles.date} selectable>
            {moment(data.created_at).format("D/M/Y")}
          </Text>
        </View>
      </View>

      <View style={styles.middleContainer}>
        <Label
          data={[
            {
              title: "Given Name",
              value: data.given_name,
              icon: { name: "text", type: "ionicon" },
            },
            {
              title: "Family Name",
              value: data.family_name,
              icon: { name: "text", type: "ionicon" },
            },
            {
              title: "Sex",
              value: data.sex,
              icon: { name: "person" },
            },
            {
              title: "Birth Date",
              value: moment(data.dateofbirth).format("D/M/Y"),
              icon: { name: "cake" },
            },
          ]}
          heading="Personal Info"
        />

        <Label
          data={[
            {
              title: "Phone",
              value: data.primary_phone,
              icon: { name: "phone" },
            },
            { title: "Email", value: data.email, icon: { name: "email" } },
            {
              title: "Area",
              value: data.area,
              icon: { name: "map" },
            },
            {
              title: "Address",
              value: data.address,
              icon: { name: "location", type: "ionicon" },
            },
          ]}
          heading="Contact Info"
        />

        <Label
          data={[
            {
              title: "Occupation",
              value: data.occupation,
              icon: { name: "work" },
            },
            {
              title: "Marital Status",
              value: data.marital_status,
              icon: { name: "interests" },
            },
            {
              title: "Education Level",
              value: data.education,
              icon: { name: "school" },
            },
          ]}
          heading="Other Details"
        />
      </View>
    </ScrollView>
  );
};

export default DetailsLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 16,
  },
  topContainer: {
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    paddingBottom: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  actions: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
  },
  actionButton: {
    height: 60,
    width: 90,
    borderRadius: 10,
    backgroundColor: "#f7f7f7",
    flexDirection: "column",
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: "600",
  },
  subContainer: {
    alignItems: "center",
    margin: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
  },
  date: {
    fontSize: 12,
    fontWeight: "400",
  },
  dateView: {
    position: "absolute",
    end: 16,
    top: 16,
    flexDirection: "row",
  },
  num: {
    fontSize: 14,
    fontWeight: "400",
  },

  middleContainer: {
    marginHorizontal: 16,
    marginVertical: 16,
    paddingBottom: 50,
    gap: 16,
  },
});
