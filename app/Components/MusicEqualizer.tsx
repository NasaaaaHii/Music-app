import LottieView from "lottie-react-native";

export default function MusicEqualizer() {
    return (
    <LottieView
      source={require("./equalizer.json")}
      autoPlay
      loop
      style={{ width: 60, height: 60 }}
    />
  );
}
