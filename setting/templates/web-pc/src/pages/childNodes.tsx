import React from "react";
import ScaffoldRoute from "./scaffold";
import ThirdsRoute from './thirds';
import LabRoute from './lab';
import HomeRoute from "./home";

export default [
  <ScaffoldRoute path="/scaffold" key="/scaffold" />,
  <ThirdsRoute path="/thirds" key="/thirds" />,
  <LabRoute path="/lab" key="/lab"/>,
  <HomeRoute path="/home" key="/home" />,
];
