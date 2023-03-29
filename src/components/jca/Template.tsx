import React, { useEffect, useState, useMemo, useCallback } from "react";
import styled from "@emotion/styled";
import {
  CardContent,
  Card as MuiCard,
  Divider as MuiDivider,
} from "@mui/material";
import { spacing } from "@mui/system";
const Card = styled(MuiCard)(spacing);

export default function Template(props:any) {
    const { url } = props;
    const [height, setHeight] = useState(0);
    useEffect(() => {
        window.addEventListener(
            "message",
                (e) => {
                    if (e.origin === process.env.NEXT_PUBLIC_MNGJSPDOMAIN && e.data.scrollHeight) {
                        setHeight(e.data.scrollHeight);
                    }
                },
            false
        );
    }, []);

    return (
        <>
            <Card mb={6}>
                <CardContent>
                    <iframe
                        src={url}
                        frameBorder={0}
                        height={height}
                    >
                    </iframe>
                </CardContent>
            </Card>
        </>
    );
}
