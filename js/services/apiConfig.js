// db.json sits at the project root. Resolving it relative to THIS file works
// both locally and on GitHub Pages (https://<user>.github.io/HotelManagement/),
// so no hard-coded URL is needed.
export const DB_URL = new URL("../../db.json", import.meta.url).href;
export default DB_URL;
