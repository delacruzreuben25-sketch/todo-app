import { Tabs, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabLayout() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const user = await AsyncStorage.getItem("user_profile");

    if (!user) {
      router.replace("/login" as any);
    }

    setLoading(false);
  };

  if (loading) return null;

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Tasks" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}