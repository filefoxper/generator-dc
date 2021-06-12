export const getCookie = (key: string) => {
  const reg = new RegExp(`(^| )${encodeURIComponent(key)}=([^;]*)(;|$)`);
  const arr: RegExpMatchArray | null = window.document.cookie.match(reg);
  if (arr) {
    return decodeURIComponent(arr[2]);
  }
};

export const deleteCookie = (key: string, path = '/') => {
  const value = getCookie(key);
  const date = new Date();
  date.setTime(date.getTime() - 1);
  if (value) {
    window.document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(
      value
    )};expires=${date.toUTCString()};path=${path}`;
  }
};

const getExpires = (expiredays?: Date) => {
  return expiredays ? `;expires=${expiredays.toUTCString()}` : '';
};

export const setCookie = (
  key: string,
  value: string,
  expires: Date,
  path = '/'
) => {
  const current = getCookie(key);
  if (current) {
    deleteCookie(key);
  }
  window.document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(
    value
  )}${getExpires(expires)};path=${path}`;
};
