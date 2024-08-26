import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { SvgXml } from "react-native-svg";

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";

import { getAuthCaptcha } from "@/service";
import Toast from "react-native-toast-message";
import { AlertCircleIcon } from "@/components/ui/icon";

const bgImage = require("../assets/images/login_bg.png");
const logoImage = require("../assets/images/logo.png");

const createLoginSchema = z.object({
  phone: z
    .string()
    .min(11, "请输入手机号")
    .regex(new RegExp("/^1[3-9]d{9}$/"), "请输入中国大陆地区手机号"),
  captcha: z.string().min(4, "请输入图形验证码").max(4, "请输入图形验证码"),
});

type LoginSchemaType = z.infer<typeof createLoginSchema>;

export default function Login() {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(createLoginSchema),
  });

  const onSubmit = (data: any) => console.log(data);

  const [captcha, setCaptcha] = useState("");
  const getSmsCode = (data: any) => {
    console.log("data: ", data);
    Toast.show({
      type: "success",
      text1: "短信验证码已发送",
    });
  };

  const getCaptcha = async () => {
    const { data } = await getAuthCaptcha();
    setCaptcha(`${data}`);
    Toast.show({
      type: "success",
      text1: "短信验证码已发送",
    });
  };

  useEffect(() => {
    getCaptcha();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <LinearGradient style={styles.gradient} colors={["#f0f0ff", "#ffffff"]}>
          <ImageBackground
            source={bgImage}
            resizeMode="cover"
            className="flex-1 justify-center items-center"
          >
            <View className="items-center">
              <Image
                style={styles.image}
                source={logoImage}
                contentFit="cover"
                transition={1000}
              />

              <Text
                className="text-primary-500 text-4xl my-6"
                style={{ fontFamily: "AlimamaFangYuanTiVF-Thin" }}
              >
                科 技 识 狠 活
              </Text>

              <VStack className="w-4/5 gap-6 mt-8">
                {/* <FormControl
                  className="w-full gap-4"
                  isInvalid={Boolean(errors.captcha)}
                >
                  <Controller
                    control={control}
                    name="phone"
                    rules={{
                      required: true,
                      validate: async (value) => {
                        try {
                          await createLoginSchema.parseAsync({
                            phone: value,
                          });
                          return true;
                        } catch (error: any) {
                          return error.message;
                        }
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <FormControlLabel className="mb-1">
                          <FormControlLabelText>手机号</FormControlLabelText>
                        </FormControlLabel>
                        <Input className="w-full">
                          <InputField
                            type="text"
                            placeholder="请输入手机号"
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                          />
                        </Input>
                        <FormControlError>
                          <FormControlErrorIcon as={AlertCircleIcon} />
                          <FormControlErrorText>
                            {errors.phone?.message}
                          </FormControlErrorText>
                        </FormControlError>
                      </>
                    )}
                  ></Controller>
                </FormControl>

                <FormControl className="w-full" isInvalid={true}>
                  <Controller
                    control={control}
                    name="captcha"
                    rules={{
                      required: true,
                      validate: async (value) => {
                        try {
                          await createLoginSchema.parseAsync({
                            captcha: value,
                          });
                          return true;
                        } catch (error: any) {
                          return error.message;
                        }
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <>
                        <FormControlLabel className="mb-1">
                          <FormControlLabelText>
                            图形验证码
                          </FormControlLabelText>
                        </FormControlLabel>

                        <View className="w-full flex flex-row items-center justify-between">
                          <Input className="flex-1">
                            <InputField
                              type="text"
                              placeholder="请输入图形验证码"
                              onChange={onChange}
                              onBlur={onBlur}
                              value={value}
                            />
                          </Input>

                          {captcha && (
                            <Pressable onPress={getCaptcha}>
                              <SvgXml xml={captcha} height={35} width={140} />
                            </Pressable>
                          )}
                        </View>
                        <FormControlError>
                          <FormControlErrorIcon as={AlertCircleIcon} />
                          <FormControlErrorText>
                            111111
                            {errors.captcha?.message}
                          </FormControlErrorText>
                        </FormControlError>
                      </>
                    )}
                  ></Controller>
                </FormControl>

                <Button
                  isPressed
                  onPress={async () => {
                    console.log("111");
                    await handleSubmit((val) => {
                      console.log("val: ", val);
                    });
                  }}
                  size="lg"
                >
                  <ButtonText>获取短信验证码</ButtonText>
                </Button> */}

                <Controller
                  control={control}
                  rules={{
                    required: true,
                    validate: async (value) => {
                      try {
                        await createLoginSchema.parseAsync({
                          phone: value,
                        });
                        return {
                          value,
                          message: "请输入手机号",
                        };
                      } catch (error: any) {
                        return error.message;
                      }
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <>
                      <FormControl context={control}>
                        <FormControlLabel className="mb-1">
                          <FormControlLabelText>手机号</FormControlLabelText>
                        </FormControlLabel>
                        <Input className="w-full">
                          <InputField
                            type="text"
                            placeholder="请输入手机号"
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                          />
                        </Input>
                        {errors.phone && (
                          <FormControlError>
                            <FormControlErrorIcon as={AlertCircleIcon} />
                            <FormControlErrorText>
                              {errors.phone?.message}
                            </FormControlErrorText>
                          </FormControlError>
                        )}
                      </FormControl>
                    </>
                  )}
                  name="phone"
                />

                <Controller
                  control={control}
                  rules={{
                    maxLength: 100,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Last name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="captcha"
                />

                <Button isPressed onPress={handleSubmit(onSubmit)} size="lg">
                  <ButtonText>获取短信验证码</ButtonText>
                </Button>
              </VStack>
            </View>
          </ImageBackground>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  image: {
    width: 75,
    height: 75,
  },
});
