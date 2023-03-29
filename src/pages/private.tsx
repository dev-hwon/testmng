import React from "react";
import type { ReactElement } from "react";

import AuthGuard from "../components/guards/AuthGuard";
import DashboardLayout from "../layouts/Dashboard";
import DefaultDashboard from "./dashboard/default";
import PageGuard from "../components/guards/PageGuard";

function Private() {
  return (
    <AuthGuard>
      <PageGuard>
        <DefaultDashboard />
      </PageGuard> 
    </AuthGuard>
  );
}

Private.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Private;
