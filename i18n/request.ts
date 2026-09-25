import {getRequestConfig} from "next-intl/server";

const SUPPORTED_LOCALES = ["en", "es"];
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !SUPPORTED_LOCALES.includes(locale)) {
    locale = DEFAULT_LOCALE;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
