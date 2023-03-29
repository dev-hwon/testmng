import React from "react";
import styled from "@emotion/styled";
import * as Yup from "yup";
import { Formik } from "formik";
import { useRouter } from "next/router";

import {
  Alert as MuiAlert,
  Checkbox,
  FormControlLabel,
  Button,
  TextField as MuiTextField,
} from "@mui/material";
import { spacing } from "@mui/system";

import useAuth from "../../hooks/useAuth";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)<{ my?: number }>(spacing);

function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().max(20).required("ID is required"),
        password: Yup.string().max(255).required("Password is required"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          // AxiosResponse
          await signIn(values.email, values.password);
          router.push("/private");
          const accessToken = window.localStorage.getItem("accessToken");  
          
        } catch (error: any) {
          console.log(error);
          //const message = error.message
          const message = "로그인에 실패했습니다";
          setStatus({ success: false });
          setErrors({ submit: message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Alert mt={3} mb={3} severity="info">
            id 와 비밀번호 를 입력하세요
          </Alert>
          {errors.submit && (
            <Alert mt={2} mb={3} severity="warning">
              {errors.submit}
            </Alert>
          )}
          <TextField
            type="email"
            name="email"
            label="ID"
            value={values.email}
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            onBlur={handleBlur}
            onChange={handleChange}
            my={2}
          />
          <TextField
            type="password"
            name="password"
            label="Password"
            value={values.password}
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            onBlur={handleBlur}
            onChange={handleChange}
            my={2}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            로그인
          </Button>
        </form>
      )}
    </Formik>
  );
}

export default SignIn;
