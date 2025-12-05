'use client';

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { useEffect } from 'react';
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
} from 'react-i18next';

import { defaultNS, getOptions, languages } from './config';

const runsOnServerSide = typeof window === 'undefined';

let hasInit = false;

const initialize = (lng?: string) => {
  if (hasInit) {
    return;
  }
  hasInit = true;

  i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init({
      ...getOptions(),
      lng: lng || undefined,
      detection: {
        order: ['cookie', 'path', 'htmlTag', 'navigator'],
      },
      preload: runsOnServerSide ? languages : [],
    });
};

export function useTranslation(
  lng?: string,
  ns: string | string[] = defaultNS,
  options: Record<string, unknown> = {}
) {
  const globalLocale = (global as Record<string, unknown>).locale as
    | string
    | undefined;
  initialize(globalLocale || lng);

  const ret = useTranslationOrg(ns, options);
  const { i18n } = ret;

  useEffect(() => {
    if (
      runsOnServerSide &&
      i18n.resolvedLanguage !== globalLocale &&
      globalLocale
    ) {
      i18n.changeLanguage(globalLocale);
    } else if (!runsOnServerSide && i18n.resolvedLanguage !== lng) {
      i18n.changeLanguage(lng);
    }
  }, [lng, i18n, globalLocale]);
  return ret;
}
