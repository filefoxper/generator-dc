import React, {memo, useCallback} from "react";
import classNames from 'classnames';
import { RouteComponentProps } from "react-router";
import css from './style.less';
import {push} from "@/utils/history";

export default memo((props: RouteComponentProps) => {

  const handleLinkClick = useCallback(() =>{
      push('/document');
  },[]);

  return (
      <div className={css.main}>
          <div className={css.body}>
              <div className={css.welcome}>欢迎使用 generator-dc</div>
              <div className={css.line}>通俗，易懂</div>
              <div className={css.line}>不隐藏，无魔法</div>
              <div className={css.line}>读改自由，实非框架</div>
              <div className={classNames(css.lib,css.mtop)}>
                  经典三方库保驾护航：react，react-router，classnames，lodash，axios，antd，moment ......
              </div>
              <div className={classNames(css.lib,css.line)}>
                  新兴三方库持续助力：agent-reducer，use-agent-reducer，type-qs ......
              </div>
          </div>
          <div className={css.bottom}>
              <a className={css.link} onClick={handleLinkClick}>使用说明</a>
          </div>
      </div>
  );
});
