import { db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "@react-native-firebase/firestore";

const BEER_CARD_COLLECTION = "beerCard";

export async function getBeerCardUrl(): Promise<string | null> {
  const urlRef = doc(db, `${BEER_CARD_COLLECTION}/url`);
  const docSnap = await getDoc(urlRef);

  if (docSnap.exists()) {
    const data = docSnap.data() as { url: string };
    return data.url;
  }

  return null;
}

export async function updateBeerCardUrl(url: string): Promise<void> {
  const urlRef = doc(db, `${BEER_CARD_COLLECTION}/url`);
  await setDoc(urlRef, { url }, { merge: true });
}
