import React, { memo } from "react";
import { RouteComponentProps } from "react-router";
import {Decorator} from "@/components/layouts/container";

export default memo((props: RouteComponentProps) => {
  return (
      <Decorator title="使用说明" desc="正在建设中"/>
  );
});
