import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";

import { Avatar, Icon, Paper, Typography } from "@mui/material";

import AuthLayout from "../../layouts/Auth";

import SignInComponent from "../../components/auth/SignIn";

import EnuriLogoIcon from "../../../public/e_icon.svg";

import Image from "next/image";

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
  margin-top: 20px;
`;

function SignIn() {
  return (
    <React.Fragment>
      <EnuriLogoIcon width="64" height="100%" />
      <Wrapper>
        <SignInComponent />
      </Wrapper>
    </React.Fragment>
  );
}

SignIn.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default SignIn;
