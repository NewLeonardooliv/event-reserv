import { currentSettings } from '@/constants/settings.constans';
import { Semaphore } from 'async-mutex';

const semaphore = new Semaphore(currentSettings.maxUsers);

export const acquireSemaphore = async () => {
  const release = await semaphore.acquire();
  return release;
};

export const releaseSemaphore = async () => {
  const release = await semaphore.release();
  return release;
};
