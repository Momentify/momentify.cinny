import { EncryptedAttachmentInfo } from 'browser-encrypt-attachment';
import { decryptFile } from '../../../utils/matrix';

// from https://github.com/timdereaper1/caching-forms-in-react/blob/text-to-link/src/App.tsx
const URL_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;

export const getFileSrcUrl = async (
  httpUrl: string,
  mimeType: string,
  encInfo?: EncryptedAttachmentInfo
): Promise<string> => {
  if (encInfo) {
    if (typeof httpUrl !== 'string') throw new Error('Malformed event');
    const encRes = await fetch(httpUrl, { method: 'GET' });
    const encData = await encRes.arrayBuffer();
    const decryptedBlob = await decryptFile(encData, mimeType, encInfo);
    return URL.createObjectURL(decryptedBlob);
  }
  return httpUrl;
};

export const getSrcFile = async (src: string): Promise<Blob> => {
  const res = await fetch(src, { method: 'GET' });
  const blob = await res.blob();
  return blob;
};

export const getUrlLinksInText = (textBody: string): (string | URL)[] =>
  textBody
    .split(' ')
    .map((t) => t.match(URL_REGEX))
    .flat()
    .filter((t) => t)
    .map((t) => {
      if (!t?.startsWith('https://') && !t?.startsWith('http://')) return `https://${t}`;
      return t;
    });
