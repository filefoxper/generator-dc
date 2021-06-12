放置样式性组件，这些组件可以读取全局数据，但除了提供样式和显示，不提供数据出口，没有交互逻辑。

```
layouts
      |
      container
              |
              index.temp
              style.less
              type.ts
```

index.temp

```tsx
export const Body = ({ children }) => {
  return <div className={css.body}>{children}</div>;
};

export const Container = ({ children }) => {
  return <div className={css.container}>{children}</div>;
};
```
