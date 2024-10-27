import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouteInfo } from "expo-router/build/hooks";

import {
  useActivityResult,
  navigateForResult,
} from "@/hooks/useNavigateForResult";
import HeaderButton from "@/components/HeaderButton";
import SelectDialog from "@/components/inputs/SelectDialog";
import RangeDatePicker from "@/components/inputs/RangeDatePicker";
import SingleDatePicker from "@/components/inputs/SingleDatePicker";

export default function FilterScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRouteInfo();
  const { data } = route.params ?? {};
  const {
    showSingleDate,
    showRangeDate,
    showCommunity,
    showAssociation,
    showOffice,
    showRegion,
    showDistrict,
    selected,
  } = data ? JSON.parse(data) : {};

  const { callback, setCallback2 } = useActivityResult();
  const [result, setResult] = useState(selected ?? null);
  const [regionItem, setRegionItem] = useState(selected?.region ?? null);
  const [districtItem, setDistrictItem] = useState(selected?.district ?? null);
  const [officeItem, setOfficeItem] = useState(selected?.office ?? null);
  const [communityItem, setCommunityItem] = useState(
    selected?.community ?? null
  );
  const [associationItem, setAssociationItem] = useState(
    selected?.association ?? null
  );
  const [dateItem, setDateItem] = useState(selected?.date ?? null);
  const [dateRangeItem, setDateRangeItem] = useState(
    selected?.dateRange ?? null
  );

  const handleNext = () => {
    if (callback) callback(result);
    router.back();
  };
  const handleCancel = () => {
    if (callback) {
      callback(result);
      router.back();
    }
  };

  useEffect(() => {
    navigation.setOptions({
      presentation: "fullScreenModal",
      title: "",
      headerLeft: () => (
        <HeaderButton bolded={false} title={"Cancel"} onPress={handleCancel} />
      ),
      headerRight: () => (
        <HeaderButton
          title={"Filter"}
          disabled={!result}
          onPress={handleNext}
        />
      ),
    });
  }, [navigation, result]);

  const handleRegionMenu = async () => {
    const data = await navigateForResult(
      setCallback2,
      router,
      "menus/screens/regions",
      { selected: regionItem ? [regionItem.id] : [] }
    );
    if (data && data.length > 0) {
      setRegionItem(data[0]);
      setResult({ ...result, region: data[0] });
    }
  };

  const handleDistrictMenu = async () => {
    const data = await navigateForResult(
      setCallback2,
      router,
      "menus/screens/districts",
      {
        selected: districtItem ? [districtItem.id] : [],
        regionId: regionItem?.id,
      }
    );
    if (data && data.length > 0) {
      setDistrictItem(data[0]);
      setResult({ ...result, district: data[0] });
    }
  };

  const handleOfficeMenu = async () => {
    const data = await navigateForResult(
      setCallback2,
      router,
      "menus/screens/offices",
      { selected: officeItem ? [officeItem.id] : [] }
    );
    if (data && data.length > 0) {
      setOfficeItem(data[0]);
      setResult({ ...result, office: data[0] });
    }
  };

  const handleCommunityMenu = async () => {
    const data = await navigateForResult(
      setCallback2,
      router,
      "menus/screens/communities",
      { selected: communityItem ? [communityItem.id] : [] }
    );
    if (data && data.length > 0) {
      setCommunityItem(data[0]);
      setResult({ ...result, community: data[0] });
    }
  };

  const handleAssoicationMenu = async () => {
    const data = await navigateForResult(
      setCallback2,
      router,
      "menus/screens/associations",
      { selected: associationItem ? [associationItem.id] : [] }
    );
    if (data && data.length > 0) {
      setAssociationItem(data[0]);
      setResult({ ...result, association: data[0] });
    }
  };

  const handleDateRange = (startDate, endDate) => {
    setDateRangeItem({ startDate, endDate });
    setResult({ ...result, dateRange: { startDate, endDate } });
  };

  const handleSingleDate = (date) => {
    setDateItem(date);
    setResult({ ...result, date });
  };

  return (
    <View style={styles.container}>
      {showSingleDate ? (
        <SingleDatePicker
          label={"Date"}
          placeholder={"Select Date"}
          value={dateItem}
          onDateSelected={handleSingleDate}
        />
      ) : null}
      {showRangeDate ? (
        <RangeDatePicker
          label={"Period"}
          placeholder={"Select Date Range"}
          value={dateRangeItem}
          onDateSelected={handleDateRange}
        />
      ) : null}

      {showRegion ? (
        <SelectDialog
          label={"Select Region"}
          placeholder={"Select a region"}
          value={regionItem?.name}
          onPress={handleRegionMenu}
        />
      ) : null}

      {showDistrict ? (
        <SelectDialog
          label={"Select District"}
          placeholder={"Select a district"}
          value={districtItem?.name}
          onPress={handleDistrictMenu}
        />
      ) : null}

      {showOffice ? (
        <SelectDialog
          label={"Select Office"}
          placeholder={"Select an Office"}
          value={officeItem?.name}
          onPress={handleOfficeMenu}
        />
      ) : null}

      {showCommunity ? (
        <SelectDialog
          label={"Select Community"}
          placeholder={"Select a Community"}
          value={communityItem?.name}
          onPress={handleCommunityMenu}
        />
      ) : null}

      {showAssociation ? (
        <SelectDialog
          label={"Select Association"}
          placeholder={"Select an Association"}
          value={associationItem?.name}
          onPress={handleAssoicationMenu}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginTop: 10,
  },
});
