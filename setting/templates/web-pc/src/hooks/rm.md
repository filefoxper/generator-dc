存放各种公共非组件型 hooks（组件级 hook 通常会由 components 中相关的组件自主提供），比如：usePersist,useSelection 等......

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
export const useSelection = <T>(range: T[], selection: T[], options: Opt) => {};
```
