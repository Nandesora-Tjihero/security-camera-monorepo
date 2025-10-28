import { writeFileSync } from "fs";

// This is the service account JSON file that you downloaded from Firebase
import serviceAccount from "./security-camera-4324d-firebase-adminsdk-n0104-631e387710.json" assert { type: "json" };

writeFileSync(
  "./.env",
  `FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT=${JSON.stringify(serviceAccount)}`,
  { flag: "a" }
);
