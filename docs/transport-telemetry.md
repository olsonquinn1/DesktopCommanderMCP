# Transport telemetry

The Broadcast callback records one `received` event with `params.transport=broadcast` when a targeted `new_call` enters. It passes that observed source through the doorbell and tool handler. `observeTransport` leaves `transport` out when the delivery source is unknown; Broadcast-specific `notification_id` and `attempt_number` appear only when Broadcast is explicitly supplied. Other checkpoints use their stage as the event name. It captures a UTC timestamp before the existing doorbell handler fetches or claims the call. The event carries `call_id`, `device_id`, `observation_id`, and `source_process_id` for correlation with Remote MCP's dispatch observations. Duplicate callbacks produce separate receipts. Other devices on the per-user channel and malformed identifiers produce none.

`device_call_received` records each valid targeted row entering `handleNewToolCall()` before the local duplicate check. Duplicate deliveries therefore produce separate observations; calls for other devices do not.

Claim, fallback read, and result write operations emit `operation_start` and `operation_end` with the same `operation_id`. Transport observations carry timestamps, stage and operation labels, correlation identifiers, and a bounded raw `tool_name` once the call row is known. The Broadcast callback receipt has no tool name. These events do not send durations or outcomes.

The event uses Desktop Commander's existing telemetry proxy sender through `captureTransport()`. Its opt-out settings and best-effort failure handling apply. No command or database request waits for telemetry, and no arguments, results, account ID, or bearer token are sent in the event. The public collector treats these device reports as unverified; they must stay separate from authenticated backend evidence.

Only `observeTransport` validates its event with `@desktop-commander/telemetry-contract/transport`; `captureTransport()` sends those fields without general analytics metadata. Other `capture()` events do not use the transport contract. The local package in `vendor/telemetry-contract` is copied from telemetry-proxy's `packages/telemetry-contract` at base commit `775643fe324a4e6e0e15d73672fb9ccd9b500bff`, including the working-tree change that makes `monotonic_ms` optional. The root dependency uses `file:vendor/telemetry-contract`; package distribution will be decided separately.

UTC timestamps can correlate device and server records, but clock skew prevents a precise one-way latency claim. These device events do not include a monotonic clock for deriving reliable short durations. A missing receipt is unknown delivery, not proof of loss.

Run `npm run test:transport:telemetry` to check the Broadcast receipt, optional transport, operation pairs, target filtering, the outgoing `/mp/collect` body, and ordinary `capture()` behavior. The collector's transport-event support must be deployed before analyzing these events.
