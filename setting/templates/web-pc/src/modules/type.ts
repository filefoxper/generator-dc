import { OriginAgent } from "agent-reducer";

export interface SharingModel<T = any> extends OriginAgent<T> {
  initial?: () => T | Promise<T>;
}
