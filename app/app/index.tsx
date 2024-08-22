import { Button, ButtonText } from "@/components/ui/button";
import { View } from "react-native";
import { Link, Redirect, Stack } from "expo-router";

export default function Index() {
  const { user } = {} as any;

  if (!user) {
    console.log("user: ", user);
    return <Redirect href="/login" />;
  }

  return (
    <View className="flex-1 h-screen w-screen flex justify-center items-center overflow-hidden">
      <Button size="md" variant="solid" action="primary">
        <ButtonText>Hello World!</ButtonText>
      </Button>
      <Button size="md" variant="solid" action="primary">
        <ButtonText>
          <Link href={{ pathname: "/login", params: { name: "Bacon" } }}>
            Go to Login
          </Link>
        </ButtonText>
      </Button>
    </View>
  );
}
