import assert from 'node:assert/strict';
import {
  REMOTE_DENIED_TOOLS,
  homeLabRemoteToolDecision,
} from '../dist/security/homelab-policy.js';

assert.deepEqual(REMOTE_DENIED_TOOLS, ['set_config_value']);

assert.deepEqual(
  homeLabRemoteToolDecision('set_config_value', false),
  { allowed: true },
);

const denied = homeLabRemoteToolDecision('set_config_value', true);
assert.equal(denied.allowed, false);
assert.match(denied.reason, /cannot mutate local HomeLab Commander policy/);

for (const tool of ['get_config', 'read_file', 'start_process']) {
  assert.deepEqual(homeLabRemoteToolDecision(tool, true), { allowed: true });
}

console.log('HomeLab remote policy test: PASS');
