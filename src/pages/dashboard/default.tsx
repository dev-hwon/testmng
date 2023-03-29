import React from "react";
import styled from "@emotion/styled";
import type { ReactElement } from "react";
import {
  Grid,
} from "@mui/material";
import DashboardLayout from "../../layouts/Dashboard";
import Notice from "../dashboard/notice";
import AuthGuard from "../../components/guards/AuthGuard";
import Memo from "../../components/dashboard/memo";
import Bookmark from "../../components/dashboard/bookmark";
import PageGuard from "../../components/guards/PageGuard";
import Annual from "../../components/dashboard/annual";
import AnnualOff from "../../components/dashboard/annual_off"
import 'bootstrap/dist/css/bootstrap.css';

const CustomGrid = styled(Grid)`
    height: 600px;
    overflow-y: scroll;
`;


function Default() {
  return (
      <Grid container spacing={6} sx={{ height: '100%' }}>
        <Grid item xs={12} lg={8} >
          <Grid container spacing={6}>
            <Grid item xs={12} lg={6}  >
              <Notice />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Memo />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Bookmark />
            </Grid>
            <Grid item xs={12} lg={6}>
              <Annual />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={4} >
          <AnnualOff />
        </Grid>
      </Grid>
  );
}

export default Default;
