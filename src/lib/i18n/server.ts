import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { cookies } from 'next/headers';
import { initReactI18next } from 'react-i18next/initReactI18next';

import { defaultNS, fallbackLng, getOptions, languages } from './config';

const initI18next = async (lng: string, ns: string | string[]) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init({
      ...getOptions(lng, ns),
      lng: undefined,
      detection: {
        order: ['cookie', 'path', 'htmlTag', 'navigator'],
      },
      preload: languages,
    });
  return i18nInstance;
};

export type ServerTranslationOptions = {
  lng?: string;
  ns?: string | string[];
  options?: {
    keyPrefix?: string;
  };
};

export async function getServerTranslation(opts?: ServerTranslationOptions) {
  const { lng, ns = defaultNS, options = {} } = opts ?? {};
  const cookieLocale = await cookies();

  const cookieResult = cookieLocale.get('i18next')?.value;
  const locale = lng ?? cookieResult ?? fallbackLng;
  const i18nextInstance = await initI18next(locale, ns);

  return {
    t: i18nextInstance.getFixedT(
      locale,
      Array.isArray(ns) ? ns[0] : ns,
      options.keyPrefix
    ),
    i18n: i18nextInstance,
  };
}

export type FuncType = Awaited<ReturnType<typeof getServerTranslation>>['t'];
