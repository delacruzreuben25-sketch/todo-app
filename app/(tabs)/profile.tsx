import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const STORAGE_KEY = "user_profile";

export default function ProfileScreen() {
  const [name, setName] = useState("");

  useEffect(() => {
    checkIfAlreadyLoggedIn();
  }, []);

  const checkIfAlreadyLoggedIn = async () => {
    const savedName = await AsyncStorage.getItem(STORAGE_KEY);

    // If user already exists → go to tasks automatically
    if (savedName) {
      router.replace("/(tabs)");
    }
  };

  const saveProfile = async () => {
    if (!name.trim()) return;

    await AsyncStorage.setItem(STORAGE_KEY, name.trim());

    // After saving → go to task screen
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>

      <Text style={styles.subtitle}>
        Please enter your name to continue
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Your name..."
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.button} onPress={saveProfile}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    color: "gray",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});