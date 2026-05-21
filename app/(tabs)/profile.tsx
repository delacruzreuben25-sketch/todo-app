import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function ProfileScreen() {
  const [userName, setUserName] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadProfile();
    loadTasks();
  }, []);

  const loadProfile = async () => {
    try {
      const name = await AsyncStorage.getItem("user_profile");

      if (name) {
        setUserName(name);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem("todo_tasks");

      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user_profile");

    router.replace("/login" as any);
  };

  // Statistics
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  const progress =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  return (
    <ScrollView style={styles.container}>
      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>{userName}</Text>

        <Text style={styles.subtitle}>
          Stay productive and organized
        </Text>
      </View>

      {/* STATISTICS CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Task Statistics</Text>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Tasks</Text>
          <Text style={styles.statValue}>{totalTasks}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{completedTasks}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={styles.statValue}>{pendingTasks}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Progress</Text>
          <Text style={styles.statValue}>{progress}%</Text>
        </View>
      </View>

      {/* MOTIVATION CARD */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Productivity</Text>

        <Text style={styles.message}>
          {progress === 100
            ? "Amazing work! All tasks completed"
            : progress >= 50
            ? "You're doing great, keep going"
            : "Small progress is still progress"}
        </Text>
      </View>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },

  profileCard: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CAF50",
  },

  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },

  subtitle: {
    color: "#e8f5e9",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  statLabel: {
    fontSize: 16,
    color: "#555",
  },

  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },

  message: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },

  logoutButton: {
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
