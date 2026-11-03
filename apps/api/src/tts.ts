import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

export const VOICES: Record<string, string> = {
  female: 'vi-VN-HoaiMyNeural',
  male: 'vi-VN-NamMinhNeural',
};

export const VOICE_LABELS: Record<string, string> = {
  female: '女声',
  male: '男声',
};

function escapeXml(text: unknown): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** 用 Edge 神经语音生成 mp3 Buffer。 */
export async function synthesize(text: string, voice: string): Promise<Buffer> {
  const voiceName = VOICES[voice];
  if (!voiceName) throw new Error(`未知音色：${voice}`);
  const trimmed = String(text ?? '').trim();
  if (!trimmed) throw new Error('朗读文本为空');

  const tts = new MsEdgeTTS({
    connectionTimeoutMs: 15_000,
    synthesisTimeoutMs: 90_000,
  });
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = await tts.toStream(escapeXml(trimmed));

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    audioStream.on('data', (chunk: Buffer) => chunks.push(Buffer.from(chunk)));
    audioStream.on('end', resolve);
    audioStream.on('close', resolve);
    audioStream.on('error', reject);
  });

  const buffer = Buffer.concat(chunks);
  if (buffer.length === 0) throw new Error('语音服务没有返回音频');
  return buffer;
}
