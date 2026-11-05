// Shrink phone photos before upload: faster on slow networks and well under
// the server's size limit. Text stays readable at 1800px on the long side.
const MAX_SIDE = 1800;
const MAX_PDF_BYTES = 3_000_000;

function toBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

export async function prepareFile(file) {
  if (file.type === 'application/pdf') {
    if (file.size > MAX_PDF_BYTES) throw new Error('too_big');
    return { base64: await toBase64(file), mimeType: 'application/pdf', preview: null };
  }
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) {
    // Browser cannot decode it (e.g. HEIC on some phones): send as-is if small enough.
    if (file.size > MAX_PDF_BYTES) throw new Error('too_big');
    return { base64: await toBase64(file), mimeType: file.type || 'image/jpeg', preview: null };
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.85));
  return { base64: await toBase64(blob), mimeType: 'image/jpeg', preview: URL.createObjectURL(blob), blob };
}
