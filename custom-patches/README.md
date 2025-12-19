# Custom Chromium Patches

Custom patches for integrating AI features into ungoogled-chromium.

## Patch Files

- `content-interception.patch` - Hook into content loading pipeline
- `native-messaging.patch` - Enable native messaging with Django
- `ui-overlay.patch` - Add AI UI components to browser chrome
- `extension-api.patch` - Custom extension APIs

## Applying Patches

Patches follow GNU Quilt format and are applied using ungoogled-chromium's patch system.

See [INTEGRATION_DESIGN.md](../INTEGRATION_DESIGN.md) for details.

