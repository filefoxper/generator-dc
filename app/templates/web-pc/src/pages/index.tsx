import React from "react";
import { SwitchWith404 } from "@/components/layouts/route";
import { Route, Redirect } from "react-router";
import childNodes from "./childNodes";

export default () => {
  return (
    <SwitchWith404>
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
      {childNodes}
    </SwitchWith404>
  );
};
