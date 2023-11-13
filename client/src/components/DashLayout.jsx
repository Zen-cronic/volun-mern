import React from "react";
import DashHeader from "./DashHeader";
import { Outlet } from "react-router";
import DashFooter from "./DashFooter";

const DashLayout = () => {
  return (
    <>
      <DashHeader />
      <div style={{ minHeight: "100vh" }}>
        <Outlet />
      </div>
      <DashFooter />
    </>
  );
};

export default DashLayout;
