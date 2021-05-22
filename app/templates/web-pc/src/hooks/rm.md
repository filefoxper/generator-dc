存放各种公共非组件型hooks（组件级hook通常会由components中相关的组件自主提供），比如：usePersist,useSelection等......

```
hooks
    |
    selection
            |
            index.temp
            type.ts
```
index.temp
```ts
export const useSelection = <T>(range:T[], selection:T[], options:Opt)=> {

}
```