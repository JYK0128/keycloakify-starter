import { action } from '@storybook/addon-actions';

export const buildArgs = <T extends Record<string, unknown>>(
  defaultValues: Partial<Omit<T, 'children'>> = {},
) => {
  return new Proxy(defaultValues, {
    get: (target, prop) => {
      if (target[prop.toString()]) {
        return target[prop.toString()];
      }
      else if (/^on[A-Z]/.test(prop.toString())) {
        return action(prop.toString()); // 이벤트 핸들러를 자동으로 `action()`으로 변환
      }
      else {
        return undefined;
      }
    },
  }) as T;
};
