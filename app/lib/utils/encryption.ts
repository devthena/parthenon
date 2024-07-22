import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY ?? '';
const key = Buffer.from(encryptionKey, 'hex');

export const encrypt = (value: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `${iv.toString('hex')}:${encrypted}`;
};

export const decrypt = (encryptedText: string): string => {
  const [ivHex, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
