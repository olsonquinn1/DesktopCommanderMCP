# HomeLab Commander Security Boundary

This branch begins the HomeLab fork of Desktop Commander.

## Core rule

Remote transport is not authority.

The upstream Remote Device remains useful as a transport, but HomeLab does not
treat a connected AI client as a principal allowed to change the policy that
constrains itself.

## v0 boundary

Remote tool discovery does not advertise set_config_value.

If a remote caller invokes set_config_value directly anyway, the server denies
the call before the configuration handler runs.

Local Desktop Commander clients retain configuration access.

This closes only the self-policy-mutation path. It does not turn the upstream
command blocklist or allowedDirectories setting into a sandbox.

## Required later layers

- dedicated low-privilege Windows runtime identity
- NTFS ACL boundary around declared workspaces
- no access to operator, SSH, browser, or Remote Device credentials
- Job Object ownership for spawned processes
- kill-own-processes rather than arbitrary PID termination
- explicit network capabilities
- immutable signed policy supplied by HomeLab
- exact-request operator approval receipts
- Mission / Operations / Raw provenance emission

The existing production Desktop Commander route remains unchanged while these
layers are developed and tested side-by-side.


## Validation baseline

HomeLab fork build passes.

New HomeLab policy regression passes.

Full upstream test runner on this Windows host:
- 68 total modules
- 65 pass
- 3 fail

The exact same three failures reproduce on an untouched detached checkout of upstream base 7bad545:
- test-config-atomic-write.js: Windows EPERM rename race
- test-config-client-id-cross-process.js: Windows EPERM rename race
- test-enhanced-repl.js: test harness does not discover the installed Python command

Therefore the v0 HomeLab policy patch introduces no additional failing upstream test modules in this environment.

npm ci reports 57 inherited dependency audit findings at this base (5 low, 20 moderate, 29 high, 3 critical). This sprint does not apply npm audit fix --force because dependency remediation needs a separate compatibility/security review.
