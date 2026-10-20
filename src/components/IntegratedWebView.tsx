import { useTranslation } from "@/translations/i18n";
import { useCallback, useMemo, useState } from "react";
import { Linking } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { WebView } from "react-native-webview";
import type { ShouldStartLoadRequest } from "react-native-webview/lib/WebViewTypes";
import { Alert } from "./Alert";
import LoadingIndicator from "./LoadingIndicator";
import { ThemedView } from "./ThemedView";

export type IntegratedWebViewProps = {
  /** The URL to load (app mode params are appended automatically) */
  url: string;
  headerBackgroundColor?: string;
};

type ViewState = "loading" | "ready" | "error";
const ALLOWED_HOSTS = [process.env.EXPO_PUBLIC_FIREBASE_WEB_URL];

export function isAllowedUrl(url: string): boolean {
  try {
    const { hostname, protocol } = new URL(url);
    if (protocol !== "https:") return false;
    return ALLOWED_HOSTS.some(
      (h) => hostname === h || hostname.endsWith(`.${h}`),
    );
  } catch {
    return false;
  }
}

export function buildUrl(baseUrl: string): string {
  const url = new URL(baseUrl);
  url.pathname = url.pathname.replace(/\/{2,}/g, "/");
  url.searchParams.set("mode", "app");
  url.searchParams.set("brand", "warm");
  return url.toString();
}

export default function IntegratedWebView({
  url,
  headerBackgroundColor,
}: IntegratedWebViewProps) {
  const { t } = useTranslation();
  const [viewState, setViewState] = useState<ViewState>("loading");
  const uri = useMemo(() => buildUrl(url), [url]);
  const origin = useMemo(() => new URL(uri).origin, [uri]);

  const handleLoadEnd = useCallback(() => {
    setViewState((prev) => (prev === "error" ? "error" : "ready"));
  }, []);

  const handleError = useCallback(
    (event: {
      nativeEvent: { description?: string; statusCode?: number; url?: string };
    }) => {
      setViewState("error");
      console.error(`Failed to load webview URL: ${url}`, event.nativeEvent);
    },
    [url],
  );

  const handleShouldStartLoadWithRequest = useCallback(
    (request: ShouldStartLoadRequest): boolean => {
      const requestUrl = request.url;

      if (requestUrl.startsWith(origin)) {
        return true;
      }
      Linking.openURL(requestUrl);
      return false;
    },
    [origin],
  );

  if (!isAllowedUrl(url) || viewState === "error") {
    return (
      <ThemedView type="container">
        <Alert
          icon="info"
          size="large"
          variant="info"
          description={t("webview.error")}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView type="container">
      <WebView
        source={{ uri: uri }}
        style={styles.webview}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onHttpError={handleError}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        javaScriptEnabled
        startInLoadingState={false}
        originWhitelist={["https://*", "http://*"]}
      />
      {viewState === "loading" && <LoadingIndicator type="screen" />}
    </ThemedView>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  loadingOverlay: {
    ...({
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    } as const),
    justifyContent: "center",
    alignItems: "center",
  },
}));
