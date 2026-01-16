import { redirect } from "next/navigation";

// config
import { PATH_DEFAULT_APP } from "src/config-global";

// ----------------------------------------------------------------------

export default async function AppPage() {
  redirect(PATH_DEFAULT_APP);
}
