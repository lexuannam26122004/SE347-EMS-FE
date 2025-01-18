'use client'

import React from 'react'
import Sidebar, { SidebarItem, TypographyItem } from '@/components/Sidebar'
import { Box, Divider } from '@mui/material'
import { Building2, Wallet } from 'lucide-react'
import { ShieldCheck, Home, ScrollText, Landmark, Scale, CalendarClock, SlidersHorizontal } from 'lucide-react'
import { ChartNoAxesCombined, Users, FileSignature, Award, CalendarX } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import { useTranslation } from 'react-i18next'
import NotificationRealTime from './NotificationRealTime'
import Chat from './chat'
import { authSelector } from '@/redux/slices/authSlice'
import { useSelector } from 'react-redux'
import Loading from './Loading'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const pathname = usePathname()

    const { t } = useTranslation('common')

    const menuLeft = useSelector(authSelector)

    if (menuLeft === null || Object.keys(menuLeft).length === 0) {
        return <Loading />
    }

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar>
                {(menuLeft['Home'].IsAllowView || menuLeft['Statistics'].IsAllowView) && (
                    <TypographyItem text={t('COMMON.SIDEBAR.DASHBOARD')} />
                )}
                {menuLeft['Home'].IsAllowView && (
                    <SidebarItem
                        icon={<Home />}
                        text={t('COMMON.SIDEBAR.HOME')}
                        route='/admin'
                        active={pathname === '/admin'}
                    />
                )}
                {menuLeft['Statistics'].IsAllowView && (
                    <SidebarItem
                        icon={<ChartNoAxesCombined />}
                        text={t('COMMON.SIDEBAR.STATISTICS')}
                        // route='/statistics'
                        // active={pathname === '/statistics'}
                    >
                        {menuLeft['/admin/statistics/attendance'].IsAllowView && (
                            <SidebarItem
                                icon={<ChartNoAxesCombined />}
                                text={t('COMMON.SIDEBAR.ATTENDANCE')}
                                route='/admin/statistics/attendance'
                                active={pathname === '/admin/statistics/attendance'}
                            />
                        )}
                        {/* {menuLeft['/admin/statistics/benefits'].IsAllowView && (
                            <SidebarItem
                                icon={<ChartNoAxesCombined />}
                                text={t('COMMON.SIDEBAR.BENEFITS')}
                                route='/admin/statistics/benefits'
                                active={pathname === '/admin/statistics/benefits'}
                            />
                        )} */}
                        {menuLeft['/admin/statistics/salary'].IsAllowView && (
                            <SidebarItem
                                icon={<ChartNoAxesCombined />}
                                text={t('COMMON.SIDEBAR.SALARY')}
                                route='/admin/statistics/salary'
                                active={pathname === '/admin/statistics/salary'}
                            />
                        )}
                        {menuLeft['/admin/statistics/employee-contract'].IsAllowView && (
                            <SidebarItem
                                icon={<ChartNoAxesCombined />}
                                text={t('COMMON.SIDEBAR.EMPLOYEE-CONTRACT')}
                                route='/admin/statistics/employee-contract'
                                active={pathname === '/admin/statistics/employee-contract'}
                            />
                        )}
                        {menuLeft['/admin/statistics/timeoff-errorreport'].IsAllowView && (
                            <SidebarItem
                                icon={<ChartNoAxesCombined />}
                                text={t('COMMON.SIDEBAR.TIMEOFF-ERRORREPORT')}
                                route='/admin/statistics/timeoff-errorreport'
                                active={pathname === '/admin/statistics/timeoff-errorreport'}
                            />
                        )}
                        {menuLeft['/admin/statistics/rewards-disciplines'].IsAllowView && (
                            <SidebarItem
                                icon={<ChartNoAxesCombined />}
                                text={t('COMMON.SIDEBAR.REWARDS_DISCIPLINE')}
                                route='/admin/statistics/rewards-disciplines'
                                active={pathname === '/admin/statistics/rewards-disciplines'}
                            />
                        )}
                        {menuLeft['/admin/statistics/notifications-events'].IsAllowView && (
                            <SidebarItem
                                icon={<ChartNoAxesCombined />}
                                text={t('COMMON.SIDEBAR.NOTIFICATIONS_EVENTS')}
                                route='/admin/statistics/notifications-events'
                                active={pathname === '/admin/statistics/notifications-events'}
                            />
                        )}
                    </SidebarItem>
                )}
                {(menuLeft['Home'].IsAllowView || menuLeft['Statistics'].IsAllowView) && (
                    <Divider sx={{ marginTop: '15px', marginBottom: '10px', borderColor: 'var(--border-color)' }} />
                )}
                {(menuLeft['Employee'].IsAllowView ||
                    menuLeft['Contract'].IsAllowView ||
                    menuLeft['Salary'].IsAllowView ||
                    menuLeft['Schedular'].IsAllowView ||
                    menuLeft['Attendance'].IsAllowView ||
                    menuLeft['Time off'].IsAllowView ||
                    menuLeft['Permission'].IsAllowView) && (
                    <TypographyItem text={t('COMMON.SIDEBAR.HUMAN_RESOURCES')} />
                )}
                {menuLeft['Employee'].IsAllowView && (
                    <SidebarItem
                        icon={<Users />}
                        text={t('COMMON.SIDEBAR.EMPLOYEE')}
                        route='/admin/employee'
                        active={pathname === '/admin/employee'}
                    />
                )}
                {menuLeft['Contract'].IsAllowView && (
                    <SidebarItem
                        icon={<FileSignature />}
                        text={t('COMMON.SIDEBAR.CONTRACT')}
                        route='/admin/contract'
                        active={pathname === '/admin/contract'}
                    />
                )}
                {menuLeft['Salary'].IsAllowView && (
                    <SidebarItem
                        icon={<Wallet />}
                        text={t('COMMON.SIDEBAR.SALARY')}
                        route='/admin/salary'
                        active={pathname === '/admin/salary'}
                    />
                )}
                {menuLeft['Schedular'].IsAllowView && (
                    <SidebarItem
                        icon={<CalendarClock />}
                        text={t('COMMON.SIDEBAR.SCHEDULAR')}
                        route='/admin/schedular'
                        active={pathname === '/admin/schedular'}
                    />
                )}
                {/* {menuLeft['/admin/attendance'].IsAllowView && (
                    <SidebarItem
                        icon={<CalendarDays />}
                        text={t('COMMON.SIDEBAR.TIMEKEEPING')}
                        route='/admin/attendance'
                        alert={true}
                        active={pathname === '/admin/attendance'}
                    />
                )} */}
                {menuLeft['Time off'].IsAllowView && (
                    <SidebarItem
                        icon={<CalendarX />}
                        text={t('COMMON.SIDEBAR.TIME_OFF')}
                        route='/admin/time-off'
                        alert={true}
                        active={pathname === '/admin/time-off'}
                    />
                )}
                {menuLeft['Permission'].IsAllowView && (
                    <SidebarItem
                        icon={<ShieldCheck />}
                        text={t('COMMON.SIDEBAR.PERMISSION')}
                        route='/admin/permission'
                        active={pathname === '/admin/permission'}
                    />
                )}
                {(menuLeft['Employee'].IsAllowView ||
                    menuLeft['Contract'].IsAllowView ||
                    menuLeft['Salary'].IsAllowView ||
                    menuLeft['Schedular'].IsAllowView ||
                    menuLeft['Attendance'].IsAllowView ||
                    menuLeft['Time off'].IsAllowView ||
                    menuLeft['Permission'].IsAllowView) && (
                    <Divider sx={{ marginTop: '15px', marginBottom: '10px', borderColor: 'var(--border-color)' }} />
                )}

                {(menuLeft['Department'].IsAllowView || menuLeft['Role'].IsAllowView) && (
                    <TypographyItem text={t('COMMON.SIDEBAR.ORGANIZATION_DESIGN')} />
                )}
                {menuLeft['Department'].IsAllowView && (
                    <SidebarItem
                        icon={<Building2 />}
                        text={t('COMMON.SIDEBAR.DEPARTMENT')}
                        route='/admin/department'
                        active={pathname === '/admin/department'}
                    />
                )}
                {menuLeft['Role'].IsAllowView && (
                    <SidebarItem
                        icon={<Landmark />}
                        text={t('COMMON.SIDEBAR.ROLE')}
                        route='/admin/role'
                        active={pathname === '/admin/role'}
                    />
                )}
                {/* <SidebarItem
                    icon={<Network />}
                    text={t('COMMON.SIDEBAR.ORG_STRUCTURE')}
                    route='/admin/org-structure'
                    active={pathname === '/admin/org-structure'}
                /> */}
                {(menuLeft['Department'].IsAllowView || menuLeft['Role'].IsAllowView) && (
                    <Divider sx={{ marginTop: '15px', marginBottom: '10px', borderColor: 'var(--border-color)' }} />
                )}
                {(menuLeft['Work regulations'].IsAllowView ||
                    menuLeft['Insurance'].IsAllowView ||
                    menuLeft['Reward'].IsAllowView ||
                    menuLeft['Benefit'].IsAllowView ||
                    menuLeft['Discipline'].IsAllowView ||
                    menuLeft['Configuration'].IsAllowView) && (
                    <TypographyItem text={t('COMMON.SIDEBAR.REGULATIONS_AND_POLICIES')} />
                )}
                {menuLeft['Work regulations'].IsAllowView && (
                    <SidebarItem
                        icon={<ScrollText />}
                        text={t('COMMON.SIDEBAR.WORK_REGULATIONS')}
                        route='/admin/work-regulations'
                        active={pathname === '/admin/work-regulations'}
                    />
                )}
                {/* <SidebarItem
                    icon={<Clock />}
                    text={t('COMMON.SIDEBAR.WORK_SHIFT')}
                    route='/admin/work-shift'
                    alert={false}
                    active={pathname === '/admin/work-shift'}
                /> */}
                {/* {menuLeft['Insurance'].IsAllowView && (
                    <SidebarItem
                        icon={<Stethoscope />}
                        text={t('COMMON.SIDEBAR.INSURANCE')}
                        route='/admin/insurance'
                        active={pathname === '/admin/insurance'}
                    />
                )} */}
                {menuLeft['Reward'].IsAllowView && (
                    <SidebarItem
                        icon={<Award />}
                        text={t('COMMON.SIDEBAR.REWARD')}
                        route='/admin/reward'
                        active={pathname === '/admin/reward'}
                    />
                )}
                {/* {menuLeft['Benefit'].IsAllowView && (
                    <SidebarItem
                        icon={<Gift />}
                        text={t('Phúc lợi')}
                        //route='/admin/benefit'
                        //active={pathname === '/admin/benefit'}
                    >
                        {menuLeft['/admin/benefit'].IsAllowView && (
                            <SidebarItem
                                icon={<ChartNoAxesCombined />}
                                text={t('Danh sách phúc lợi')}
                                route='/admin/benefit'
                            />
                        )}
                        {menuLeft['/admin/benefit/add-employee-benefits'].IsAllowView && (
                            <SidebarItem
                                icon={<ChartNoAxesCombined />}
                                text={t('Phúc lợi nhân viên')}
                                route='/admin/benefit/add-employee-benefits'
                            />
                        )}
                    </SidebarItem>
                )} */}
                {menuLeft['Discipline'].IsAllowView && (
                    <SidebarItem
                        icon={<Scale />}
                        text={t('COMMON.SIDEBAR.DISCIPLINE')}
                        route='/admin/discipline'
                        active={pathname === '/admin/discipline'}
                    />
                )}
                {/* <SidebarItem
                    icon={<Calendar />}
                    text={t('COMMON.SIDEBAR.HOLIDAY')}
                    route='/admin/holiday'
                    active={pathname === '/admin/holiday'}
                /> */}
                {menuLeft['Configuration'].IsAllowView && (
                    <SidebarItem
                        icon={<SlidersHorizontal />}
                        text={t('COMMON.SIDEBAR.CONFIGURATION')}
                        route='/admin/configuration'
                        active={pathname === '/admin/configuration'}
                    />
                )}
            </Sidebar>
            <Box
                component='main'
                sx={{
                    flex: 1,
                    height: '100%',
                    overflowY: 'auto',
                    position: 'relative',
                    backgroundColor: 'var(--background-color)'
                }}
            >
                <Header />
                <Box
                    sx={{
                        flex: 1,
                        height: '100%',
                        paddingTop: '55px',
                        position: 'relative',
                        scrollbarGutter: 'stable both-edges',
                        '&::-webkit-scrollbar': {
                            width: '7px',
                            height: '7px',
                            backgroundColor: 'var(--background-after-color)'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'var(--scrollbar-color)',
                            borderRadius: '10px'
                        },
                        backgroundColor: 'var(--background-after-color)',
                        overflowY: 'auto'
                    }}
                >
                    <Box
                        sx={{
                            padding: '24px 17px',
                            minHeight: '100%'
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </Box>

            <NotificationRealTime />
            <Chat />
        </div>
    )
}

export default Layout
