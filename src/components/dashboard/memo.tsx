import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import swal from "sweetalert";

import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

import {
    Button,
    Card as MuiCard,
    CardContent as MuiCardContent,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    Divider as MuiDivider,
    Paper as MuiPaper,
    Typography as MuiTypography,
    CardHeader,
    Box,
} from "@mui/material";
import { spacing, SpacingProps } from "@mui/system";
import axios from "axios";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const QuillWrapper = styled.div`
  .ql-editor {
    min-height: 200px;
  }
`;

import useAuth from "../../hooks/useAuth";
import { AuthUser } from "../../types/auth";

const Card = styled(MuiCard)(spacing);

const Paper = styled(MuiPaper)`
    display: inline-block;
    margin-top: 4px;
`; 

const MessageBox = styled(Box)`
  text-align: left;
  padding: 0 15px;
`;

interface TypographyProps extends SpacingProps {
  component?: string;
}
const Typography = styled(MuiTypography)<TypographyProps>`
    white-space: pre-line;
`;

const Divider = styled(MuiDivider)(spacing);

function DrawMemo(props: any) {
    const { memo } = props;
    return (
        <MessageBox>
            <Typography gutterBottom variant="subtitle1" dangerouslySetInnerHTML={{ __html: memo }}>
            </Typography>
        </MessageBox>
    )
}

interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
    user: AuthUser;  
}

function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, selectedValue, open, user } = props;
    const [text, setText] = useState('');

    useEffect(() => {
        setText(selectedValue);
    }, [selectedValue]);

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleSave = async () => {
        if (user) {
            fnMemoInsert(user.sawonno, text);
        }
        onClose(text);
    };

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="simple-dialog-title"
            open={open}
        >
            <DialogTitle id="form-dialog-title">등록/수정</DialogTitle>
            <DialogContent>
                <DialogContentText>
                메모를 등록하고 수정합니다.
                </DialogContentText>
                <QuillWrapper>
                    <ReactQuill
                        theme="snow"
                        value={text}
                        onChange={setText}
                        placeholder="Type something.."
                    />
                </QuillWrapper>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave} color="primary">
                  저장
                </Button>
            </DialogActions>
        </Dialog>
    );
}

async function fnMemoInsert(sawonno: String, memo: String) {
    await axios.post('/api/dashboard/memoInsert', {
        sawonno: sawonno,
        memo: memo,
    })
        .then(function (response: any) {
            if (response.status == 200) {
                swal("", response.data.message, "success");
                location.reload();
            } else {
                swal("", "등록에 실패했습니다", "error");
            }
        })
        .catch(function (response: any) {
            swal("", "등록에 실패했습니다", "error");
        })
}

function Memo() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [memoDom, setMemoDom] = useState('');

    useEffect(() => {
        if (user) {
            const dataPromise = axios.get('/api/dashboard/memo?sawonno=' + user.sawonno);
            dataPromise.then(function (obj: any) {
                if (obj && obj.data.memoData) {
                    setMemoDom(obj.data.memoData.todo_memo);
                }
            });
        }
    }, [user]);
 
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false);
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardHeader
                title="메모"
                action={
                    <Button variant="text" color="primary" size="small" onClick={handleClickOpen}>
                        등록/수정
                    </Button>
                }
            />
            <SimpleDialog 
                selectedValue={memoDom}
                open={open}
                onClose={handleClose}
                user={user}
            />
            <Divider color={"#ddd"} />
            <DrawMemo memo={memoDom} /> 
        </Card>
    )
}

export default Memo;