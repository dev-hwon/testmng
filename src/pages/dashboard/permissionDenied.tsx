import React from "react";
import styled from "@emotion/styled";
import type { ReactElement } from "react";
import DashboardLayout from "../../layouts/Dashboard";
import { Helmet } from "react-helmet-async";
import { Button as MuiButton, Typography } from "@mui/material";
import Link from "next/link";

import { spacing } from "@mui/system";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(6)};
  text-align: center;
  background: transparent;

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function Page_Permission() {
  return (
    <Wrapper>
        <Helmet title="Permission Denied" />
        <Typography component="h1" variant="h1" align="center" gutterBottom>
            권한이 없습니다.
        </Typography>
        <Typography component="h2" variant="body1" align="center" gutterBottom>
            관리자에게 문의해주세요.
        </Typography>
    </Wrapper>
  );
}

Page_Permission.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Page_Permission;
