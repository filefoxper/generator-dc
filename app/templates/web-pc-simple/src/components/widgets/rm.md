放置第三方或自己封装的与业务无关组件，比如：input,checkbox 等......

```
widgets
      |
      input
          |
          index.temp
          style.less
          type.ts
```

index.temp

```tsx
import { Input as AntdInput } from 'antd';

export const Input = AntdInput;
```
