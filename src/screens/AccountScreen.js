import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  onAuthStateChanged,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { getDoc, doc, setDoc } from "firebase/firestore";
import defaultAvatar from "../images/avatar.png";

export default function AccountScreen() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const avatarOptions = [
    require("../images/avatar.png"),
    require("../images/avatar2.png"),
  ];
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatar);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) loadUserInfo(currentUser.uid);
    });
    return unsubscribe;
  }, []);

  const loadUserInfo = async (userId) => {
    try {
      const docSnap = await getDoc(doc(db, "users", userId));
      if (docSnap.exists()) setUserInfo(docSnap.data());
      else console.log("No user data found!");
    } catch (error) {
      console.error("Error loading user info:", error);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
      setShowRegisterForm(false);
    } catch {
      setError("Correo o contraseña incorrectos.");
    }
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !birthDate) {
      setError("Completa todos los campos.");
      return;
    }
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        firstName,
        lastName,
        birthDate: birthDate.toISOString(),
      });
      setError("");
      setShowRegisterForm(false);
    } catch (err) {
      setError("Error al registrarse: " + err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setShowRegisterForm(true);
  };

  const handleReauthenticateAndChangePassword = async () => {
    if (user && newPassword && currentPassword) {
      try {
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setError("");
        setNewPassword("");
        setCurrentPassword("");
      } catch (err) {
        setError("Error al actualizar la contraseña: " + err.message);
      }
    } else {
      setError("Por favor ingresa todos los campos.");
    }
  };

  const handleDateChange = (_, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setBirthDate(selectedDate);
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>¡Hola, {user?.email || "invitado"}!</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowAccountInfo(true)}
          >
            <Text style={styles.buttonText}>Ver información de la cuenta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </>
      ) : showRegisterForm ? (
        <>
          <Text style={styles.title}>Inicia sesión</Text>
          <TextInput
            placeholder="Correo"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
          <Text style={styles.switchText}>
            ¿No tienes cuenta?{" "}
            <Text
              style={styles.link}
              onPress={() => setShowRegisterForm(false)}
            >
              Regístrate
            </Text>
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.title}>Regístrate</Text>
          <TextInput
            placeholder="Correo"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            placeholder="Nombre"
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            placeholder="Apellido"
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.input, { justifyContent: "center" }]}
          >
            <Text>
              {birthDate
                ? birthDate.toDateString()
                : "Selecciona tu fecha de nacimiento"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthDate || new Date(2000, 0, 1)}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
          <Text style={styles.switchText}>
            ¿Ya tienes cuenta?{" "}
            <Text style={styles.link} onPress={() => setShowRegisterForm(true)}>
              Inicia sesión
            </Text>
          </Text>
        </>
      )}

      <Modal
        visible={showAccountInfo}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAccountInfo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Información de la Cuenta</Text>
            <TouchableOpacity onPress={() => setShowAvatarPicker(true)}>
              <Image source={selectedAvatar} style={styles.profileImage} />
            </TouchableOpacity>
            <Text style={styles.modalLabel}>Correo: {user?.email}</Text>
            <TextInput
              placeholder="Contraseña actual"
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />
            <TextInput
              placeholder="Nueva contraseña"
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleReauthenticateAndChangePassword}
            >
              <Text style={styles.modalButtonText}>Actualizar Contraseña</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#ccc" }]}
              onPress={() => setShowAccountInfo(false)}
            >
              <Text style={[styles.modalButtonText, { color: "#000" }]}>
                Cerrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAvatarPicker}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowAvatarPicker(false)}
      >
        <View style={styles.avatarPickerOverlay}>
          <View style={styles.avatarPickerContainer}>
            <Text style={styles.modalTitle}>Elige tu Avatar</Text>
            <View style={styles.avatarOptionsRow}>
              {avatarOptions.map((avatar, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedAvatar(avatar);
                    setShowAvatarPicker(false);
                  }}
                >
                  <Image source={avatar} style={styles.avatarOption} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#0a84ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  switchText: { textAlign: "center", marginTop: 10 },
  link: { color: "#0a84ff", fontWeight: "bold" },
  error: { color: "red", textAlign: "center", marginBottom: 8 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  modalLabel: { fontSize: 16, marginVertical: 8 },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#0a84ff",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  modalButtonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  avatarPickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPickerContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  avatarOptionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 8,
  },
});
