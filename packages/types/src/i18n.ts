export type SupportedLanguages = 'pt' | 'fr' | 'de' | 'it';

export interface TranslationResources {
  [lang: string]: {
    [key: string]: string | TranslationResources;
  };
}
