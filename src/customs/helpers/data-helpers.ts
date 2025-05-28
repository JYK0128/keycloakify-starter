import { omit, pick } from 'lodash-es';

export function safeParse(v: unknown) {
  try {
    return JSON.parse(v as string);
  }
  catch {
    return v === 'undefined' ? undefined : v;
  }
};

export function deconstruct<T extends object, U extends keyof T>(obj: T, args: Array<U>): [Pick<T, U>, Omit<T, U>] {
  return [pick(obj, args), omit(obj, args)];
}

export const fileStreamLoader = (file: File) => {
  const create = (
    callback?: (file: File, pct: number) => void,
  ) => {
    const totalSize = file.size;
    let uploadedBytes = 0;

    const transformStream = new TransformStream<Uint8Array, Uint8Array>({
      start() {
        callback?.(file, Math.min((uploadedBytes / totalSize) * 100, 100));
      },
      transform(chunk, controller) {
        uploadedBytes += chunk.length;

        // Call callback with progress percentage
        callback?.(file, Math.min((uploadedBytes / totalSize) * 100, 100));

        controller.enqueue(chunk);
      },
      flush(controller) {
        controller.terminate();
      },
    });

    return file.stream().pipeThrough(transformStream);
  };

  return { create };
};

