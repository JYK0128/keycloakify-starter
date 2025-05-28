/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ExtendKcContext } from 'keycloakify/login';
import { createContext, useContext } from 'react';
import type { KcEnvName, ThemeName } from '../kc.gen';
import { useI18n } from './i18n';

export type KcContextExtension = {
  themeName: ThemeName
  properties: Record<KcEnvName, string> & {}
  // NOTE: Here you can declare more properties to extend the KcContext
  // See: https://docs.keycloakify.dev/faq-and-help/some-values-you-need-are-missing-from-in-kccontext
};

export type KcContextExtensionPerPage = {};

export type KcContext = ExtendKcContext<KcContextExtension, KcContextExtensionPerPage>;
export const KcContext = createContext<KcContext | undefined>(undefined);
export const usePageContext = <T extends KcContext>() => {
  const kcContext = useContext(KcContext) as T | undefined;
  if (kcContext === undefined) {
    throw new Error('useKcContext must be used within a KcContextProvider');
  }
  const { i18n } = useI18n({ kcContext });
  if (i18n === undefined) {
    throw new Error('useKcContext must be used within a KcContextProvider');
  }
  return { i18n, kcContext };
};
