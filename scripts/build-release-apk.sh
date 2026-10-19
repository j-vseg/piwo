#!/bin/bash
set -euo pipefail

NODE_DIR="$(dirname "$(which node)")"
export PATH="$NODE_DIR:$PATH"
export JAVA_HOME="${JAVA_HOME:-$(/usr/libexec/java_home 2>/dev/null || true)}"

REQUIRED_VARS=("PATH_TO_KEYSTORE" "KEYSTORE_PASSWORD" "KEY_ALIAS" "KEY_PASSWORD")
for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var:-}" ]; then
    echo "Error: $var is not set"
    echo "Required env vars: ${REQUIRED_VARS[*]}"
    exit 1
  fi
done

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_GRADLE="$PROJECT_ROOT/android/app/build.gradle"
KEYSTORE_DEST="$PROJECT_ROOT/android/app/release.keystore"

cp "$PATH_TO_KEYSTORE" "$KEYSTORE_DEST"

cleanup() {
  rm -f "$KEYSTORE_DEST"
  cd "$PROJECT_ROOT"
  git checkout -- android/app/build.gradle 2>/dev/null || true
}
trap cleanup EXIT

python3 -c "
import sys
content = open(sys.argv[1]).read()

content = content.replace(
    '''    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }''',
    '''    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            storeFile file('release.keystore')
            storePassword '${KEYSTORE_PASSWORD}'
            keyAlias '${KEY_ALIAS}'
            keyPassword '${KEY_PASSWORD}'
        }
    }'''
)

content = content.replace(
    'signingConfig signingConfigs.debug\n            def enableShrinkResources',
    'signingConfig signingConfigs.release\n            def enableShrinkResources'
)

open(sys.argv[1], 'w').write(content)
" "$BUILD_GRADLE"

echo "Building release APK..."
cd "$PROJECT_ROOT/android"
./gradlew --no-daemon assembleRelease

APK_PATH="$PROJECT_ROOT/android/app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
  mkdir -p "$PROJECT_ROOT/public"
  cp "$APK_PATH" "$PROJECT_ROOT/public/piwo.apk"
  echo ""
  echo "Done! APK copied to public/piwo.apk"
else
  echo "Error: APK not found at $APK_PATH"
  exit 1
fi
