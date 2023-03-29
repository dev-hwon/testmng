import React from 'react';
import styled from "@emotion/styled";
import InputBase from '@mui/material/InputBase';

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        border: '1px solid #ced4da',
        padding: '10px 26px 10px 12px',
    },
}));

export default BootstrapInput;