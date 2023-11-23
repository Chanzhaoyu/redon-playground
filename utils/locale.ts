export const getLocale = <T = any>(token: string): T | void => {
  if (!token || typeof token !== "string") {
    console.error("token is not string");
    return;
  }
  const local: string = localStorage.getItem(token) ?? "";
  return local ? JSON.parse(local) : null;
};

export const setLocale = <T = any>(token: string, locale: any): T | void => {
  if (!token || typeof token !== "string") {
    console.error("token is not string");
    return;
  }
  return localStorage.setItem(token, JSON.stringify(locale));
};
