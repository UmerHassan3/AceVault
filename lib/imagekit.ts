import "server-only";

import ImageKit, { toFile } from "@imagekit/nodejs";

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export async function uploadImage(
  file: Buffer,
  fileName: string,
  folder: string
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

  return { url: response.url, fileId: response.fileId };
}

export async function deleteImage(fileId: string) {
  await client.files.delete(fileId).catch(() => {
    // best-effort cleanup, ignore failures
  });
}
