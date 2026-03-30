import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export async function createDecision(decisionData) {
  try {
    const docRef = await addDoc(collection(db, "decisions"), {
      //uuid: decisionData.uuid ?? null,
      join_code: decisionData.join_code ?? null,
      name: decisionData.name ?? "",
      category: decisionData.category ?? "",
      options: decisionData.options ?? [],
      result: decisionData.result ?? null,
      created_at: serverTimestamp(),
    });

    console.log("Created decision with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating decision:", error);
    throw error;
  }
}