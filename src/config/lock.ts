import { Mutex } from "async-mutex";

const mutex = new Mutex();

export const acquireLock = async (): Promise<() => void> => {
  const release = await mutex.acquire();
  return release; 
};
