/**
 * HomeLab remote policy boundary.
 *
 * Remote transport is not authority.  The connected AI must not be able to
 * mutate the local policy that constrains its own execution path.
 *
 * This is intentionally a very small first boundary.  OS identity, ACL,
 * process, network, and capability containment are separate later layers.
 */

export const REMOTE_DENIED_TOOLS = Object.freeze([
  'set_config_value',
] as const);

const REMOTE_DENIED_SET = new Set<string>(REMOTE_DENIED_TOOLS);

export type HomeLabRemoteDecision =
  | { allowed: true }
  | { allowed: false; reason: string };

export function homeLabRemoteToolDecision(
  toolName: string,
  isRemote: boolean,
): HomeLabRemoteDecision {
  if (!isRemote) {
    return { allowed: true };
  }

  if (REMOTE_DENIED_SET.has(toolName)) {
    return {
      allowed: false,
      reason: 'remote callers cannot mutate local HomeLab Commander policy',
    };
  }

  return { allowed: true };
}
