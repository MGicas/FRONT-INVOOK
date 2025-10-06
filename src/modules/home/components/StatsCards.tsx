import { Card, CardContent, Typography, CircularProgress, Alert } from "@mui/material"
import { Box } from "@mui/system"
import { Assignment, AssignmentTurnedIn, AssignmentLate } from "@mui/icons-material"
import { useStats } from "../hook/useStats";


export const StatsCards = () => {
    const { stats, isLoading, error } = useStats();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    if (!stats) {
        return null;
    }

    const statsData = [
        {
            title: 'Abiertos hoy',
            value: stats.open_started_today.count.toString(),
            icon: <Assignment sx={{ fontSize: 40, color: '#2e7d32' }} />,
            change: `${stats.open_started_today.percentage.toFixed(1)}%`,
        },
        {
            title: 'Cerrados hoy',
            value: stats.closed_opened_today.count.toString(),
            icon: <AssignmentTurnedIn sx={{ fontSize: 40, color: '#2e7d32' }} />,
            change: `${stats.closed_opened_today.percentage.toFixed(1)}%`,
        },
        {
            title: 'Vencidos abiertos',
            value: stats.overdue_open.count.toString(),
            icon: <AssignmentLate sx={{ fontSize: 40, color: '#2e7d32' }} />,
            change: `${stats.overdue_open.percentage.toFixed(1)}%`,
        },
    ];

    return (
        <>
            {statsData.map((stat) => (
                <Card key={stat.title} sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ mr: 2 }}>
                                {stat.icon}
                            </Box>
                            <Box>
                                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                                    {stat.value}
                                </Typography>
                                <Typography color="text.secondary" variant="body2">
                                    {stat.title}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'medium' }}>
                            {stat.change} del total
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </>
    )
}