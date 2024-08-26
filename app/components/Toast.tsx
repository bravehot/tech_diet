import ToastMessage, { BaseToast } from "react-native-toast-message";

export default function Toast() {
  return (
    <ToastMessage
      config={{
        success: (props) => (
          <BaseToast
            {...props}
            style={{ borderLeftColor: "rgb(139,92,246)" }}
          />
        ),
      }}
    />
  );
}
