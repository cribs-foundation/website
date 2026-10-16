# Cloud environment

## Environment variables

```
KRU_STORE_REPO=ap-justin/kru-store
```

## Network access

Custom, *include defaults* on, plus:

```
mcp.context7.com
api.sanity.io
apicdn.sanity.io
```

## Setup script

```bash
#!/bin/bash
# kru v0.148.0
set -uo pipefail
exec > >(tee -a /tmp/setup.log) 2>&1

try() {
  for _ in 1 2 3; do "$@" && return 0; sleep 2; done
  echo "SETUP FAIL: $*"
}

# kru store
try git clone -q https://github.com/ap-justin/kru-store ~/.kru
[ -f ~/.kru/setup.sh ] && try bash ~/.kru/setup.sh

# plugins
try claude plugin marketplace add anthropics/claude-plugins-official
try claude plugin marketplace add ap-justin/kru
try claude plugin install kru@kru --scope user
try claude plugin enable cc-plugin-you-should-know@builtin --scope user
try claude plugin install sanity@claude-plugins-official --scope user
try claude plugin install vercel@claude-plugins-official --scope user
try claude plugin install typescript-lsp@claude-plugins-official --scope user

# cribs-foundation: vm provisioning
try npm i -g typescript-language-server typescript@6

node --version; claude plugin list
exit 0
```
