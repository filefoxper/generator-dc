import React, { memo, Suspense } from 'react';
import { initial } from '@/modules';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import css from './style.less';

const App = React.lazy(async () => {
  const [AppComponent] = await Promise.all([
    import(/* app */ './app'),
    initial()
  ]);
  return AppComponent;
});

const BlankApp = memo(() => {
  return (
    <div className={css.blank}>
      <span>正在加载基本数据...</span>
    </div>
  );
});

export default () => {
  return (
    <Suspense fallback={<BlankApp />}>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </Suspense>
  );
};
