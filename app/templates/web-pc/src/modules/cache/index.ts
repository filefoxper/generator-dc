import {OriginAgent, sharing} from "agent-reducer";
import {CacheState} from "./type";

export class Cache implements OriginAgent<CacheState> {

    state = {};

    setCache = (key: string, value: any) => {
        return {...this.state, [key]: value};
    }

    removeCache = (key: string) => {
        const entries = Object.entries(this.state).filter(([k]) => k !== key);
        return Object.fromEntries(entries);
    }

}

export const cacheRef = sharing(()=>Cache);