type PresignedURLResponse = {
  filename: string;
  uploadURL: string;
};

export const uploadFile = async (file: File) => {
  const presignedResponse = (await (
    await fetch('/api/presigned-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
  ).json()) as PresignedURLResponse;

  const formData = new FormData();
  formData.append('file', file);

  await fetch(presignedResponse.uploadURL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: formData,
  });

  return {
    remoteFilename: presignedResponse.filename,
  };
};
