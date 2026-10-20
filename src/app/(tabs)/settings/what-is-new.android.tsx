import IntegratedWebView from "@/components/IntegratedWebView";
import { getPageUrl } from "@/utils/getPageUrl";

export default function Screen() {
  return <IntegratedWebView url={getPageUrl("/what-is-new")} />;
}
