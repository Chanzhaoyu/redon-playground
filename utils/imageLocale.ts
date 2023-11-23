import { getLocale, setLocale } from "./locale";

export const LOCAL_TOKEN = "__IMAGE__";

export const getImageLocale = () => getLocale(LOCAL_TOKEN);

export const setImageLocale = (locale: any) => setLocale(LOCAL_TOKEN, locale);
