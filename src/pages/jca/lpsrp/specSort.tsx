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
          src={process.env.NEXT_PUBLIC_MNGJSPDOMAIN+'/lsv2016/specsort/index.jsp'}
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
        <Helmet title="상세검색 현황조회" />
        <Typography variant="h3" gutterBottom display="inline">
          상세검색 현황조회
        </Typography>
        <BookmarkStar pageNo={31} />

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