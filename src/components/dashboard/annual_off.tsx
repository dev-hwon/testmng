import styled from "@emotion/styled";
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { spacing } from "@mui/system";
import {
  Card as MuiCard,
  CardHeader,
  Chip as MuiChip,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider as MuiDivider
} from "@mui/material";
import { UncontrolledCollapse, Button, CardBody } from 'reactstrap';


const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);

const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 90%;
  color: ${(props) => props.theme.palette.common.white};
`;

const TableWrapper = styled.div`
  overflow-y: auto;
  overflow-y: scroll;
  max-height: 830px;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)});
`;

const AnnualList = (props: any) => {
    const { data } = props;
    const list = [];

    for (let i = 0; i < data.length; i++) {
        list.push(data[i]);
    }
    return (
        <>
            {list.map((item, v) => (
                <TableRow key={v}>
                    {item.off_main_code == 1  && <TableCell><Chip label="연차" color="warning" /></TableCell>}
                    {(item.off_main_code == 2 && item.off_sub_name == "AM") && <TableCell><Chip label="반차 -AM" color="primary" /></TableCell>}
                    {(item.off_main_code == 2 && item.off_sub_name == "PM") && <TableCell><Chip label="반차 -PM" color="secondary" /></TableCell>}
                    {(item.off_main_code != 1 && item.off_main_code != 2) && <TableCell><Chip label={item.off_main_name} color="default" /></TableCell>}

                    <TableCell component="th" scope="row">{item.mm_nm}({item.mm_id})</TableCell>
                </TableRow>
            ))}
        </>
    )
}
//연차=01(warning)/
//반차=02 am(primary-초록) pm(secondary-연두)  
//복지휴가=03 /경조휴가 = 04 /예비군=05 /장기근속휴가=06 /공가=07  (default-흰색)
const AnnualOff = ( ) => {
  const [list, setList] = useState(Array);
  const [today, setToday] = useState("");

  useEffect(() => {
      axios.get('/api/dashboard/annual_off_api')
        .then((result) => {
          if (result.data.status == 'success') {
            setList(result.data.data.getAnalOffArr);
            setToday(result.data.data.today);
          }else if (result.data.status == 'fail') {
            
            if (result.data.data.ajaxFail == '00') { //날짜 못 받아왔을 때
              console.log(result.data.data.errorMsg);
              setList(result.data.data.getAnalOffArr);
              setToday("");

            }else if (result.data.data.ajaxFail == '01') { //select조회 실패했을 때
              console.log(result.data.data.errorMsg);
              setList([]);
              setToday(result.data.data.today);
            }
          }
        });
  },[])

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader id="toggle"
        title = {`🎈전사 통합 일정 🏄‍♂️${today} `}
      />
      <Divider />

      <Paper>
          <TableWrapper>
              <Table>
                  <TableBody>
                      <AnnualList data={list} />
                  </TableBody>
              </Table>
          </TableWrapper>
      </Paper>
    </Card> 
  )
}

export default AnnualOff;