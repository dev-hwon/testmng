import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import dynamic from "next/dynamic";

import {
    Button,
    Card as MuiCard,
    CardContent as MuiCardContent,
    CardHeader,
    Divider as MuiDivider,
    Paper as MuiPaper,
    Typography as MuiTypography,
} from "@mui/material";
import { spacing, SpacingProps } from "@mui/system";
import axios from "axios";

import Swal from '../../common/Swal';
import useAuth from "../../hooks/useAuth";
import DoughnutChart from "../pages/dashboard/saas/DoughnutChart2";

const Card = styled(MuiCard)(spacing);


const Paper = styled(MuiPaper)`
    display: inline-block;
    margin-top: 4px;
`;

const CardContent = styled(MuiCardContent)`
  border-bottom: 1px solid ${(props) => props.theme.palette.grey[300]};
`;

interface TypographyProps extends SpacingProps {
  component?: string;
}
const Typography = styled(MuiTypography)<TypographyProps>`
    white-space: pre-line;
`;

const Divider = styled(MuiDivider)(spacing);


interface AnnualProps{
    mm_nm: string;
    fix_cnt: string;
    remain_cnt: string;
}
const url = '/api/dashboard/annual_api';


function Annual() {
    const { user } = useAuth();
    const [remainData, setRemainData] = useState(0.0);
    const [fixData, setFixData] = useState(0.0);
   
    // console.log(user)
    useEffect(() => {
        if (user) {
            const params = { mm_id: user.id };
            const dataPromise = axios.get(url, { params });
            dataPromise.then(function (obj: any) {
                // console.log(obj)
                if (obj && obj.data) {
                    
                    let procSuccess = obj.data.procSuccess;
                    if (user.id != undefined) {
                        let mm_nm = obj.data.getSelectLeave.mm_nm;
                        let fix_cnt = +parseFloat(obj.data.getSelectLeave.fix_cnt).toFixed(1); //number type
                        let remain_cnt = +parseFloat(obj.data.getSelectLeave.remain_cnt).toFixed(1); //number type
                        setRemainData(remain_cnt);
                        setFixData(fix_cnt);

                        /*
                        //console.log(remainData);
                        console.log(fixData);
                        console.log('bool : ' + bool);
                        
                        let annualCopy = [...annual];
                        annualCopy[0] = mm_nm;
                        annualCopy[1] = fix_cnt.toFixed(1); //string type
                        annualCopy[2] = remain_cnt.toFixed(1); //string type
                    //  setAnnual([...annual, annualCopy]);
                        // setAnnualTrns(annualCopy);
                        setBool(true);
                        */
                    }
                }
            });
        }
    }, [user])
    
    return (
        <Card sx={{ height: '100%' }} >
            <CardHeader
                title="근태 현황"
                action={
                    <Button variant="text" color="primary" size="small">
                        📆
                    </Button>
                }
            />
            <Divider />
            {!!user && (
                <React.Fragment>
                    <div style={{ fontSize: 18, marginBottom: 10, textAlign: 'center' }}>
                        <span style={{
                            fontSize: 20,
                            fontWeight: "bold"
                        }}>
                            {user.name}
                        </span>
                        님의 잔여 연차
                    </div>
                    <DoughnutChart
                        remainData={remainData}
                        fixData={fixData}
                    />
                </React.Fragment>
            )}
        </Card>
    )
}
export default Annual;