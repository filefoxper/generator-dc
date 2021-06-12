import React, { memo } from 'react';
import classNames from 'classnames';
import { useAgentMethods } from 'use-agent-reducer';
import { pageSwitchRef } from '@/modules/pageSwitch';
import css from './style.less';

export default memo(() => {
  const { switchTo } = useAgentMethods(pageSwitchRef.current);

  return (
    <div className={css.main}>
      <div className={css.body}>
        <div className={css.welcome}>欢迎使用 generator-dc</div>
        <div className={css.line}>通俗，易懂</div>
        <div className={css.line}>不隐藏，无魔法</div>
        <div className={css.line}>读改自由，实非框架</div>
        <div className={classNames(css.lib, css.mtop)}>
          经典三方库保驾护航：react，react-router，classnames，lodash，axios，antd，moment
          ......
        </div>
        <div className={classNames(css.lib, css.line)}>
          新兴三方库注入活力：agent-reducer，use-agent-reducer，type-qs ......
        </div>
        <div className={classNames(css.lib, css.line)}>
          编译开发库持续发展：webpack5，babel7，typescript4 ......
        </div>
        <div className={classNames(css.lib, css.line)}>
          校验辅助库一统江山：prettier，eslint ......
        </div>
      </div>
      <div className={css.bottom}>
        <a className={css.link} onClick={() => switchTo('scaffold')}>
          脚手架用法
        </a>
        <a className={css.link} onClick={() => switchTo('thirds')}>
          第三方库简介
        </a>
        <a className={css.link} onClick={() => switchTo('lab')}>
          DC 实验室
        </a>
      </div>
    </div>
  );
});
