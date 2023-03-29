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

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);

function Template() {
  return (
    <Card mb={6}>
      <CardContent>
        <iframe
          src={process.env.NEXT_PUBLIC_MNGJSPDOMAIN+'/promotion/promotion_admin.jsp'}
            frameBorder={0}
        >
        </iframe>
      </CardContent>
    </Card>
  );
}

function JSP_Content() {
  return (
    <AuthGuard>
      <PageGuard>
        <Helmet title="쇼핑몰 프로모션 자동화" />
        <Typography variant="h3" gutterBottom display="inline">
          쇼핑몰 프로모션 자동화
        </Typography>
        <BookmarkStar pageNo={39} />
      
        <Divider my={6} />

        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Template />
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