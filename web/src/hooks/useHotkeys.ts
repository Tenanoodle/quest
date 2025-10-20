import { DependencyList } from 'react';
import { useHotkeys as useReactHotkeys } from 'react-hotkeys-hook';

export const useHotkeys = (
  keys: string | string[],
  callback: (event: KeyboardEvent, handler: any) => void,
  deps: DependencyList = []
) => {
  useReactHotkeys(keys, callback, { enableOnFormTags: true }, deps);
};
