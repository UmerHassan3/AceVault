import "server-only";

import ImageKit, { toFile } from "@imagekit/nodejs";

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export async function uploadImage(
  file: Buffer,
  fileName: string,
  folder: string,
  options?: { lossless?: boolean }
) {
  const response = await client.files.upload({
    file: await toFile(file, fileName),
    fileName,
    folder,
    useUniqueFileName: true,
  });

  if (!response.url || !response.fileId) {
    throw new Error("ImageKit upload did not return a url/fileId");
  }

  // ImageKit's account-level delivery defaults can auto-convert uploads to a
  // lossy format (observed serving our generated PNGs back as JPEG), which
  // visibly blurs crisp text/logos. Force lossless PNG delivery for
  // precisely-designed generated graphics (receipts, credential images).
  const url = options?.lossless
    ? `${response.url}?tr=f-png,q-100`
    : response.url;

  return { url, fileId: response.fileId };
}

export async function deleteImage(fileId: string) {
  await client.files.delete(fileId).catch(() => {
    // best-effort cleanup, ignore failures
  });
}
