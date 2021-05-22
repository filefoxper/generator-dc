import {createAgentReducer} from "agent-reducer";
import {SharingModel} from "./type";
import {cacheRef} from './cache';

const modules = [
  cacheRef,
];

export const initial = () => {
  const initialPromises = modules.map(async (sharing):Promise<any> => {
    const model = sharing.current as SharingModel;
    const { agent } = createAgentReducer(model);
    const { initial } = agent;
    if (!initial) {
      return null;
    }
    return initial();
  });
  return Promise.all(initialPromises);
};