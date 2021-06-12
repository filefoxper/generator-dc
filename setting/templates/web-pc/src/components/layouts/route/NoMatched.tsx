import React from "react";
import { Decorator } from "@/components/layouts/container";
import { Route } from "react-router";

export default () => {
  return (
    <Route>
      <Decorator title="页面呢？" desc="搓麻将去了......404" />
    </Route>
  );
};
