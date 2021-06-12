存放各种全局公共定义，比如：Role,ShopType 等......

```
constant
       |
       role.ts
       shopType.ts
```

role.ts

```ts
export enum Role {
  GUEST,
  USER,
  MASTER,
  ADMIN
}
```
