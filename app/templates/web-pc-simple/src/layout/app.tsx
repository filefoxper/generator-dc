import React, { memo, useMemo } from 'react';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import Home from '@/pages/home';
import Lab from '@/pages/lab';
import Scaffold from '@/pages/scaffold';
import Thirds from '@/pages/thirds';
import { useAgentSelector } from 'use-agent-reducer';
import { pageSwitchRef } from '@/modules/pageSwitch';
import css from './style.less';

export default memo(() => {
  const path = useAgentSelector(pageSwitchRef.current, state => state);

  const renderPage = useMemo(() => {
    if (path === 'home') {
      return <Home />;
    }
    if (path === 'scaffold') {
      return <Scaffold />;
    }
    if (path === 'thirds') {
      return <Thirds />;
    }
    return <Lab />;
  }, [path]);
  return (
    <div className={css.container}>
      <ConfigProvider locale={zhCN}>{renderPage}</ConfigProvider>
    </div>
  );
});
