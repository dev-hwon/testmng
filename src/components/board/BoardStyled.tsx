import styled from "@emotion/styled";
import InputBase from '@mui/material/InputBase';
import {
    Paper,
    Breadcrumbs as MuiBreadcrumbs,
} from "@mui/material";
import { spacing } from "@mui/system";

const BootstrapInput = styled(InputBase)(() => ({
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        border: '1px solid #ced4da',
        padding: '10px 26px 10px 12px',
    },
}));

export const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

export const TopnotiList = styled.ul`
    padding:20px;
    list-style:none;
    line-height: 1.6;
    margin:0;
    >li {
        position: relative;
        padding-left: 12px;
        &.important {
            color: ${(props) => props.theme.palette.primary.main};
        }
        &:before {
            content: "-";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            padding: 0 2px;
        }
    }
`;

// export const AutoSizeImageWrapper = styled.div`
//     width: 80%;
//     & > span {
//         position: unset !important;
//         & .autoImage {
//             object-fit: contain !important;
//             position: relative !important;
//             height: 400px !important;
//             width: 600px !important;
//         }
//     }
// `;

export default BootstrapInput;