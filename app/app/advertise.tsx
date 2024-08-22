import { View, StyleSheet, Text } from "react-native";

export default function Advertise() {
  return (
    <View className="flex-1 bg-white">
      <Text style={styles.text}>advertise</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  image: {
    width: 120,
    height: 120,
  },
  text: {
    fontFamily: "AlimamaFangYuanTiVF-Thin",
  },
});
