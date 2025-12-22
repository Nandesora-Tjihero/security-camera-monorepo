import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWebRTC } from '../composables/useWebRTC';

describe.todo('useWebRTC', () => {
  let webrtc: ReturnType<typeof useWebRTC>;

  beforeEach(() => {
    webrtc = useWebRTC();
  });

  it('should start and stop broadcasting', async () => {});
});
