import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export async function createDecision(decisionData, participantId) {
  try {
    const hasRequiredFirebaseConfig = Boolean(
      db.app?.options?.projectId && db.app?.options?.apiKey && db.app?.options?.appId
    );

    if (!hasRequiredFirebaseConfig) {
      throw new Error(
        "Firebase isnt configured so add the EXPO_PUBLIC_FIREBASE_ vals first."
      );
    }

    const decisionsCollection = collection(db, "decisions");
    const docRef = doc(decisionsCollection);
    // 6 character random join code
    const joinCode = (decisionData.join_code ?? Math.random().toString(36).slice(2, 8)).toUpperCase();

    //had to add local participants so it could see who it was waiting on, but no user auth
    const savedDecision = {
      uuid: docRef.id,
      join_code: joinCode,
      name: decisionData.name ?? "",
      category: decisionData.category ?? "",
      options: decisionData.options ?? [],
      result: decisionData.result ?? null,
      created_at: serverTimestamp(),
      phase: decisionData.phase ?? "options",
      participants: participantId ? [participantId] : [],
      completed_voters: [],
      result_votes: null,
    };

    await setDoc(docRef, savedDecision);

    console.log("created decision with ID:", docRef.id);
    return {
      ...savedDecision,
      created_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error creating decision:", error);
    throw error;
  }
}