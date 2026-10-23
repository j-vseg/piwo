#!/bin/bash
set -euo pipefail

NODE_DIR="$(dirname "$(which node)")"
export PATH="$NODE_DIR:$PATH"
export JAVA_HOME="${JAVA_HOME:-$(/usr/libexec/java_home 2>/dev/null || true)}"

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [ "${APP_VARIANT:-}" = "production" ]; then
  ENV_FILE="$PROJECT_ROOT/.env.prod"
else
  ENV_FILE="$PROJECT_ROOT/.env.dev"
fi

if [ -f "$ENV_FILE" ]; then
  set -a
  eval "$(grep -v '^#' "$ENV_FILE" | grep -v '^$' | sed 's/=\(.*\)/='"'"'\1'"'"'/')"
  set +a
fi

echo ""
echo "Select release type:"
echo "  1) Android release"
echo "  2) Web release"
echo "  3) Both Android and Web release"
echo ""
read -rp "Choice [1/2/3]: " RELEASE_TYPE

case "$RELEASE_TYPE" in
  1) DO_ANDROID=true;  DO_WEB=false ;;
  2) DO_ANDROID=false; DO_WEB=true  ;;
  3) DO_ANDROID=true;  DO_WEB=true  ;;
  *) echo "Error: invalid choice"; exit 1 ;;
esac

if [ "$DO_ANDROID" = true ]; then
  REQUIRED_VARS=("PATH_TO_KEYSTORE" "KEYSTORE_PASSWORD" "KEY_ALIAS" "KEY_PASSWORD")
  for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var:-}" ]; then
      echo "Error: $var is not set"
      echo "Required env vars: ${REQUIRED_VARS[*]}"
      exit 1
    fi
  done
fi

read -rp "Enter version (e.g. 1.0.0): " VERSION
if [ -z "$VERSION" ]; then
  echo "Error: version is required"
  exit 1
fi

if [ "$DO_ANDROID" = true ]; then
  read -rp "Enter version code (integer): " VERSION_CODE
  if ! [[ "$VERSION_CODE" =~ ^[0-9]+$ ]]; then
    echo "Error: version code must be a positive integer"
    exit 1
  fi
fi

python3 -I -c "
import re, json, sys

version = sys.argv[1]
version_code = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] else None
config_file = sys.argv[3]
pkg_json = sys.argv[4]

content = open(config_file).read()
content = re.sub(r'version: \"[^\"]+\"', f'version: \"{version}\"', content, count=1)
if version_code:
    content = re.sub(r'versionCode: \d+', f'versionCode: {version_code}', content, count=1)
open(config_file, 'w').write(content)
print(f'Updated {config_file} to {version}' + (f' (versionCode {version_code})' if version_code else ''))

data = json.load(open(pkg_json))
data['version'] = version
json.dump(data, open(pkg_json, 'w'), indent=2)
print(f'Updated {pkg_json} to {version}')
" "$VERSION" "${VERSION_CODE:-}" "$PROJECT_ROOT/app.config.ts" "$PROJECT_ROOT/package.json"

# --- Android release ---
if [ "$DO_ANDROID" = true ]; then
  echo ""
  echo "=== Android Release ==="
  echo ""

  echo "Running prebuild..."
  cd "$PROJECT_ROOT"
  pnpm run prebuild

  BUILD_GRADLE="$PROJECT_ROOT/android/app/build.gradle"
  KEYSTORE_DEST="$PROJECT_ROOT/android/app/release.keystore"

  cp "$PATH_TO_KEYSTORE" "$KEYSTORE_DEST"

  cleanup_android() {
    rm -f "$KEYSTORE_DEST"
    cd "$PROJECT_ROOT"
    git checkout -- android/app/build.gradle 2>/dev/null || true
  }
  trap cleanup_android EXIT

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
  if [ ! -f "$APK_PATH" ]; then
    echo "Error: APK not found at $APK_PATH"
    exit 1
  fi

  cp "$APK_PATH" "$PROJECT_ROOT/piwo.apk"
  echo "APK copied to $PROJECT_ROOT/piwo.apk"
fi

# --- Web release ---
if [ "$DO_WEB" = true ]; then
  echo ""
  echo "=== Web Release ==="
  echo ""

  cd "$PROJECT_ROOT"

  echo "Generating service worker..."
  if [ "${APP_VARIANT:-}" = "production" ]; then
    pnpm run generate:sw:prod
  else
    pnpm run generate:sw
  fi

  echo "Building web export..."
  if [ "${APP_VARIANT:-}" = "production" ]; then
    pnpm run build:web:prod
  else
    pnpm run build:web
  fi

  echo "Deploying to Firebase Hosting..."
  if [ "${APP_VARIANT:-}" = "production" ]; then
    pnpx firebase-tools deploy --only hosting --project prod
  else
    pnpx firebase-tools deploy --only hosting --project dev
  fi

  echo "Web deploy complete!"
fi

# --- Git tag & GitHub release (production only) ---
if [ "${APP_VARIANT:-}" = "production" ]; then
  echo ""
  echo "=== Finishing Release ==="
  echo ""

  echo "Committing version bump..."
  cd "$PROJECT_ROOT"
  COMMIT_MSG="chore: bump version to v$VERSION"
  if [ -n "${VERSION_CODE:-}" ]; then
    COMMIT_MSG="$COMMIT_MSG ($VERSION_CODE)"
  fi
  git add -A
  git commit -m "$COMMIT_MSG"
  git push

  echo "Creating GitHub draft release v$VERSION..."
  if [ "$DO_ANDROID" = true ]; then
    gh release create "v$VERSION" \
      "$PROJECT_ROOT/piwo.apk#piwo-v${VERSION}.apk" \
      --title "v$VERSION" \
      --draft \
      --generate-notes
  else
    gh release create "v$VERSION" \
      --title "v$VERSION" \
      --draft \
      --generate-notes
  fi

  echo "Draft release v$VERSION created successfully!"
fi

echo ""
echo "Release complete!"
