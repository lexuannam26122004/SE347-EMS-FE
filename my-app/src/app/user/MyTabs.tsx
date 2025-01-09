import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { styled } from '@mui/system'
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab'
import { Tabs as BaseTabs } from '@mui/base/Tabs'
import { TabsList as BaseTabsList } from '@mui/base/TabsList'

const blue = {
    50: '#F0F7FF',
    100: '#C2E0FF',
    200: '#80BFFF',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
    800: '#004C99',
    900: '#003A75'
}

// Styled components
const Tab = styled(BaseTab)`
    font-family: 'IBM Plex Sans', sans-serif;
    color: #fff;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    background-color: transparent;
    width: 100%;
    padding: 9.5px 14px;
    margin: 5px;
    border: none;
    border-radius: 30px;
    display: flex;
    justify-content: center;

    &:hover {
        background-color: ${blue[400]};
    }

    &.${tabClasses.selected} {
        background-color: #fff;
        color: ${blue[600]};
    }
`

const TabsList = styled(BaseTabsList)`
    min-width: 400px;
    background-color: ${blue[500]};
    border-radius: 30px;
    display: flex;
    margin-right: 6px;
    align-items: center;
    place-content: space-between center;
`

function MyTabs() {
    const router = useRouter()
    const pathname = usePathname()

    const handleTabChange = (value: string) => {
        router.push(value)
    }

    return (
        <BaseTabs value={pathname} onChange={(_, value) => handleTabChange(value.toString())}>
            <TabsList>
                <Tab
                    value='/user'
                    sx={{
                        whiteSpace: 'nowrap'
                    }}
                >
                    Cá nhân
                </Tab>
                <Tab
                    value='/user/attendance'
                    sx={{
                        whiteSpace: 'nowrap'
                    }}
                >
                    Chấm công
                </Tab>
                <Tab
                    value='/user/salary'
                    sx={{
                        whiteSpace: 'nowrap'
                    }}
                >
                    Lương
                </Tab>
                <Tab
                    value='/user/rewards-disciplines'
                    sx={{
                        whiteSpace: 'nowrap'
                    }}
                >
                    Thưởng phạt
                </Tab>
                <Tab
                    value='/user/benefits-insurances'
                    sx={{
                        whiteSpace: 'nowrap'
                    }}
                >
                    Phúc lợi
                </Tab>
                <Tab
                    value='/user/requests'
                    sx={{
                        whiteSpace: 'nowrap'
                    }}
                >
                    Yêu cầu
                </Tab>
                <Tab
                    value='/user/working-rules'
                    sx={{
                        whiteSpace: 'nowrap'
                    }}
                >
                    Quy định
                </Tab>
            </TabsList>
        </BaseTabs>
    )
}

export default MyTabs
