export const getCookie = (key: string) => {
    let reg = new RegExp("(^| )" + encodeURIComponent(key) + "=([^;]*)(;|$)");
    let arr: RegExpMatchArray | null = document.cookie.match(reg);
    if (arr) {
        return decodeURIComponent(arr[2]);
    }
};

export const deleteCookie = (key: string, path: string = '/') => {
    let value = getCookie(key);
    let date = new Date();
    date.setTime(date.getTime() - 1);
    if (value) {
        document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) +
            ";expires=" + date.toUTCString() + ';path=' + path;
    }
};

const getExpires = (expiredays?: Date) => {
    return expiredays ? (";expires=" + (expiredays.toUTCString())) : '';
};

export const setCookie = (key: string, value: string, expires: Date, path: string = '/') => {
    let current = getCookie(key);
    if (current) {
        deleteCookie(key);
    }
    document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value) +
        getExpires(expires) + ';path=' + path;
};
