import { collection, doc, getDoc } from "@react-native-firebase/firestore";
import { db } from "@/firebase";
import * as Application from "expo-application";

const VERSION_COLLECTION = "appVersion";

async function getLatestSupportedVersion(): Promise<string> {
  try {
    const deviceRef = doc(collection(db, VERSION_COLLECTION), "versions");
    const deviceDoc = await getDoc(deviceRef);

    if (deviceDoc.exists()) {
      const version = deviceDoc.data() as { latestSupportedVersion: string };
      return version.latestSupportedVersion;
    } else {
      console.warn("Versions not found in Firestore");
      throw "Versions not found in Firestore";
    }
  } catch (error) {
    console.error("Error fetching app versions", error);
    throw error;
  }
}

/**
 * Compares two semantic version strings
 * @param version1 - First version string (e.g., "1.2.3")
 * @param version2 - Second version string (e.g., "1.2.4")
 * @returns 1 if version1 > version2, -1 if version1 < version2, 0 if equal
 */
function compareVersions(version1: string, version2: string): number {
  const v1Parts = version1.split(".").map((part) => parseInt(part.replace(/\D/g, ""), 10) || 0);
  const v2Parts = version2.split(".").map((part) => parseInt(part.replace(/\D/g, ""), 10) || 0);

  const maxLength = Math.max(v1Parts.length, v2Parts.length);

  for (let i = 0; i < maxLength; i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;

    if (v1Part > v2Part) return 1;
    if (v1Part < v2Part) return -1;
  }

  return 0;
}

/**
 * Checks if the current app version is above or equal to the latest supported version
 * @returns Promise<boolean> - true if current version >= latest supported version, false otherwise
 */
export async function isVersionAboveOrEqualToSupported(): Promise<boolean> {
  try {
    const latestSupportedVersion = await getLatestSupportedVersion();
    const currentVersion = Application.nativeApplicationVersion ?? "0.0.0";

    if (!latestSupportedVersion) {
      console.warn("Latest supported version not available, assuming current version is supported");
      return true;
    }

    const comparison = compareVersions(currentVersion, latestSupportedVersion);
    return comparison >= 0; // Returns true if current version >= latest supported version
  } catch (error) {
    console.error("Error checking version compatibility", error);
    throw error;
  }
}