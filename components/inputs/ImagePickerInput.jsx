// components/inputs/ImagePickerInput.js
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";
import { Avatar, Button } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";

const appName = Constants.expoConfig.name;

const ImagePickerInput = ({ value, title, onImageSelected }) => {
  const [imageUri, setImageUri] = useState(value);

  const showImagePickerOptions = () => {
    Alert.alert("Select Image", "Choose an option", [
      {
        text: "Camera",
        onPress: () => handleImagePicker(true),
      },
      {
        text: "Gallery",
        onPress: () => handleImagePicker(false),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleImagePicker = async (isCamera) => {
    // Request permission to access the camera and media library
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      permissionResult.granted === false ||
      libraryPermissionResult.granted === false
    ) {
      alert("Permission to access camera and media library is required!");
      return;
    }

    let result;

    // Launch camera or image library based on user's choice
    if (isCamera) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      const storedImageUri = await storeImageInAppFolder(result.assets[0].uri);
      setImageUri(storedImageUri);
      onImageSelected(storedImageUri);
      console.log("Image stored at:", storedImageUri);
    }
  };

  const storeImageInAppFolder = async (imageUri) => {
    try {
      // Create a folder based on the app name inside the document directory
      const folderUri = `${FileSystem.documentDirectory}${appName}/`;
      const folderInfo = await FileSystem.getInfoAsync(folderUri);

      // Create the folder if it doesn't exist
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
      }

      // Extract the image name from the URI
      const imageName = imageUri.split("/").pop();

      // Define the new path for the image in the app's folder
      const newPath = `${folderUri}${imageName}`;

      // Move the image to the app folder
      await FileSystem.moveAsync({
        from: imageUri,
        to: newPath,
      });

      console.log(`Image moved to: ${newPath}`);
      return newPath;
    } catch (error) {
      console.error("Error storing image:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imagePicker}>
        <Avatar
          source={{ uri: imageUri ? imageUri : null }}
          size={150}
          title={imageUri ? null : title.substring(0, 2)}
          icon={
            imageUri || title
              ? null
              : { name: "user", type: "font-awesome", size: 150 }
          }
          titleStyle={{ height: 150 }}
          onPress={showImagePickerOptions}
        />
        {imageUri ? (
          <TouchableOpacity
            onPress={() => setImageUri(null) || onImageSelected(null)}
            style={styles.addImage}
          >
            <Ionicons color={"red"} name="close" size={24} />
          </TouchableOpacity>
        ) : null}
      </View>
      {!imageUri ? (
        <Button
          title={"Add Photo"}
          style={{
            width: 100,
            marginTop: 8,
          }}
          titleStyle={{ fontSize: 16, color: "black", fontWeight: "400" }}
          buttonStyle={{
            backgroundColor: "#d8d8d8",
            borderRadius: 16,
            paddingVertical: 4,
          }}
          onPress={showImagePickerOptions}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: "center",
  },
  imagePicker: {
    height: 168,
    width: 168,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#c8c8c8",
    borderRadius: 8,
  },
  addImage: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "white",
    borderRadius: 24,
    shadowColor: "black",
    shadowOffset: { width: -2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
  },
});

export default ImagePickerInput;
