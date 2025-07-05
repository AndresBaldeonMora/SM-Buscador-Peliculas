import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export async function addComment(movieId, userEmail, text) {
  try {
    await addDoc(collection(db, "comments"), {
      movieId,
      userEmail,
      text,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error al agregar comentario:", error);
  }
}

export async function getComments(movieId) {
  try {
    const q = query(
      collection(db, "comments"),
      where("movieId", "==", movieId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    return [];
  }
}
