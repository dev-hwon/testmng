import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import { Helmet } from "react-helmet-async";

import {
  CardContent,
  Grid,
  Link,
  Card as MuiCard,
  Divider as MuiDivider,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import DashboardLayout from "../../../layouts/Dashboard";
import AuthGuard from "../../../components/guards/AuthGuard";
import BookmarkStar from "../../../common/BookmarkStar";
import PageGuard from "../../../components/guards/PageGuard";
import Template from "../../../components/jca/Template";
const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);

function JSP_Content() {
  return (
    <AuthGuard>
      <PageGuard>
        <Helmet title="에누리 카테고리 - OAS 맵핑" />
        <Typography variant="h3" gutterBottom display="inline">
          에누리 카테고리 - OAS 맵핑
        </Typography>
        <BookmarkStar pageNo={104} />
        
        <Divider my={6} />

        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Template url={process.env.NEXT_PUBLIC_MNGJSPDOMAIN + '/cate_OAS/index.jsp'} />
          </Grid>
        </Grid>
      </PageGuard>
    </AuthGuard>
  );
}

JSP_Content.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default JSP_Content;