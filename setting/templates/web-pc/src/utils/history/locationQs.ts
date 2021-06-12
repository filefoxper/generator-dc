import qs from "qs";

export function stringify(query: any) {
  return qs.stringify(query, { addQueryPrefix: true });
}

export function parse(search?: string) {
  return qs.parse(search || "", { ignoreQueryPrefix: true });
}
