'use client'
import {
    Box,
    //Select,
    //Pagination,
    //Typography,
    // MenuItem,
    //SelectChangeEvent,
    Paper
    //Button,
    // Tooltip
    //Checkbox,
    //TableRow,
    //TableBody,
    //Table,
    //TableCell,
    //TableHead,
    //TableContainer,
    //Button,
    //TextField,
    //InputAdornment,
    //IconButton,
    //Tooltip,
    //TableSortLabel,
    //Chip
} from '@mui/material'
//import { AlarmClock, CirclePlus, Pencil, Trash2 } from 'lucide-react'

import { useTranslation } from 'react-i18next'
import DisplayInfo from './DisplayInfo'
import Page from './ListBenefit_1'
import { useEffect } from 'react'

function Benefit_Insurance() {
    const { t } = useTranslation('common')
    useEffect(() => {}, [t])
    return (
        <Box sx={{ gap: '24px', display: 'flex', flexDirection: 'column' }}>
            <Paper
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '6px',
                    backgroundColor: 'var(--background-color)',
                    flexDirection: 'column',
                    gap: '24px',
                    padding: '24px 24px 24px 24px'
                }}
            >
                <DisplayInfo />
            </Paper>
            <Page />
        </Box>
    )
}

export default Benefit_Insurance
