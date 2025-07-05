import React, { useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignIn({ setError }) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "772874002972-4gtad8rb6klh74u9rap6a87phg3k0i4v.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((err) =>
        setError("Error al iniciar sesión con Google")
      );
    }
  }, [response]);

  return (
    <TouchableOpacity
      onPress={() => promptAsync()}
      style={[styles.button, { backgroundColor: "#db4437" }]}
    >
      <Text style={styles.buttonText}>Continuar con Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
