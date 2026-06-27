# npm Release Checklist

This package is published under the public npm package name:

```text
gbz185-sdk
```

The current public release is `gbz185-sdk@0.1.0`.

## 1. Account And Registry

```bash
npm whoami
npm config get registry
```

Expected registry:

```text
https://registry.npmjs.org/
```

If `npm whoami` returns `E401`, login first:

```bash
npm login
```

If the account has 2FA enabled, npm will ask for an OTP during publish.

## 2. Version Check

Before later releases:

```bash
npm view gbz185-sdk version dist-tags
pnpm version patch
```

Use `patch`, `minor`, or `major` according to the public API change.

## 3. Local Release Gate

Run the same checks that `prepublishOnly` runs:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
pnpm example:calendar
pnpm pack:check
```

The package should include `dist`, `docs`, `examples`, `README.md`, `LICENSE`, `CHANGELOG.md`, and `package.json`. It should not include `src`, `test`, `site`, `node_modules`, or local tarballs.

## 4. Publish

```bash
npm publish --access public
```

`package.json` already includes:

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

The explicit `--access public` flag is harmless and keeps the publish command consistent.

## 5. Post-Publish Smoke Test

After npm confirms publication:

```bash
npm view gbz185-sdk version dist-tags

mkdir -p /tmp/gbz185-sdk-npm-smoke
cd /tmp/gbz185-sdk-npm-smoke
npm init -y
npm install gbz185-sdk
node --input-type=module -e "import { formatIdentityCode, validateIdentityCode } from 'gbz185-sdk'; const id = formatIdentityCode({ registrationServiceProvider: 'A1', registrationRequester: 'REQ001', ontologySerial: 'CALENDAR', instanceSerial: '1' }); console.log(id, validateIdentityCode(id));"
```

Expected output includes:

```text
1.2.156.3088.1.A1.REQ001.CALENDAR.1 true
```

## 6. Git Tag

After a successful publish, create a tag matching the package version if it does not already exist:

```bash
git tag v0.1.0
git push origin v0.1.0
```

For later versions, tag the exact published version.
