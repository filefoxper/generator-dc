import React, { memo } from "react";
import zhCN from "antd/es/locale/zh_CN";
import { ConfigProvider } from "antd";
import PageRoutes from "@/pages";
import { instanceBy } from "@/utils/history";
import { Router } from "react-router";
import css from "./style.less";

const historyMode = process.env.history;

const {basename} = process.env;

export default memo(() => {
  return (
    <div className={css.container}>
      <ConfigProvider locale={zhCN}>
        <Router
          history={instanceBy({ mode: historyMode as "h5" | "hash", basename })}
        >
          {/* 添加app header */}
          <PageRoutes />
          {/* 添加app footer */}
        </Router>
      </ConfigProvider>
    </div>
  );
});
