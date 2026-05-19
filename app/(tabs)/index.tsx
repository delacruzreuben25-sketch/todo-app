import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const STORAGE_KEY = "todo_tasks";

export default function HomeScreen() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load tasks when the app starts
  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    saveTasks();
  }, [tasks]);

  // READ from storage
  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.log("Error loading tasks:", error);
    }
  };

  // SAVE to storage
  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.log("Error saving tasks:", error);
    }
  };

  // CREATE
  const addTask = () => {
    if (!task.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: task.trim(),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTask("");
  };

  // DELETE
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((item) => item.id !== id));
  };

  // EDIT
  const startEdit = (item: Task) => {
    setTask(item.title);
    setEditingId(item.id);
  };

  // UPDATE
  const updateTask = () => {
    if (!task.trim()) return;

    setTasks(
      tasks.map((item) =>
        item.id === editingId
          ? { ...item, title: task.trim() }
          : item
      )
    );

    setTask("");
    setEditingId(null);
  };

  // TOGGLE COMPLETE
  const toggleComplete = (id: string) => {
    setTasks(
      tasks.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const handleSubmit = () => {
    if (editingId) {
      updateTask();
    } else {
      addTask();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter task..."
        value={task}
        onChangeText={setTask}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {editingId ? "Update Task" : "Add Task"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            {/* Checkbox */}
            <TouchableOpacity onPress={() => toggleComplete(item.id)}>
              <View
                style={[
                  styles.checkbox,
                  item.completed && styles.checkboxChecked,
                ]}
              />
            </TouchableOpacity>

            {/* Task Title */}
            <Text
              style={[
                styles.taskText,
                item.completed && styles.completedText,
              ]}
            >
              {item.title}
            </Text>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => startEdit(item)}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  taskItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 6,
  },
  checkboxChecked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  editText: {
    color: "blue",
  },
  deleteText: {
    color: "red",
  },
  emptyText: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
});