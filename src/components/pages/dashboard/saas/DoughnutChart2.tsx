import React, { useState } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import Chart from "react-chartjs-2";
import { MoreVertical } from "react-feather";

import { orange, green, red } from "@mui/material/colors";
import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableHead,
  TableRow as MuiTableRow,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";

import { ThemeProps } from "../../../../types/theme";

const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 182px;
  position: relative;
`;

const DoughnutInner = styled.div`
  width: 100%;
  position: absolute;
  top: 50%;
  left: 0;
  margin-top: -22px;
  text-align: center;
  z-index: 0;
`;

const TableRow = styled(MuiTableRow)`
  height: 42px;
`;

const TableCell = styled(MuiTableCell)`
  padding-top: 0;
  padding-bottom: 0;
`;

const GreenText = styled.span`
  color: ${() => green[400]};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
`;

const RedText = styled.span`
  color: ${() => red[400]};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
`;

const DoughnutChart = (props: any) => {
  const { remainData, fixData, annual, theme } = props;
  // const { theme } = useState<ThemeProps>(any);
  // console.log("defaultData:" + fixData);
  // console.log("leaveData:" + remainData);
  // console.log(fixData - remainData);

  const data = {
    labels: ["사용 연차", "잔여 연차"],
    datasets: [
      {
        data: [fixData - remainData, remainData],
        backgroundColor: [
          //theme.palette.secondary.main, //blue
          theme.palette.grey[200],
          //red[500], //투명도
          theme.palette.secondary.main
          // orange[500],
          // theme.palette.grey[200],
        ],
        borderWidth: 7,
        borderColor: theme.palette.background.paper,
      },
    ],
  };


  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "80%",
  };

  return (
    <Card mb={6}>
        <ChartWrapper>
          <DoughnutInner>
            <div style={{
              fontSize: "18px",
              textAlign: "center"
            }}>
              <span style={{
                  fontSize: "35px",
                  color: theme.palette.secondary.main,
                  fontWeight: "bold"
              }}>
                {/* 잔여연차 */}
                  {remainData.toFixed(1)}
              </span>
              {/* 기본연차 */}
              /{fixData.toFixed(1)} 
            </div>
          
            <div style={{ textAlign: "center" }}>일</div>
          </DoughnutInner>
          <Chart type="doughnut" data={data} options={options} />
        </ChartWrapper>
        
    </Card>
  );
};

export default withTheme(DoughnutChart);
