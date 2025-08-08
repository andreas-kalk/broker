import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  TrendingUp,
  Euro,
  AccountBalance,
  ShowChart,
  Assessment
} from '@mui/icons-material';

interface RecentActivityWidgetProps {
  sections: Record<string, any> | null;
}

const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({ sections }) => {
  const theme = useTheme();

  if (!sections) {
    return null;
  }

  const getActivityItems = () => {
    const activities = [];

    // Analyze sections for recent activity
    Object.entries(sections).forEach(([sectionName, sectionData]) => {
      const dataCount = sectionData.dataRows?.length || 0;
      if (dataCount > 0) {
        activities.push({
          title: sectionName,
          description: `${dataCount} Einträge verfügbar`,
          count: dataCount,
          icon: getSectionIcon(sectionName),
          color: getSectionColor(sectionName, theme)
        });
      }
    });

    // Sort by data count and take top 5
    return activities.sort((a, b) => b.count - a.count).slice(0, 5);
  };

  const activities = getActivityItems();

  return (
    <Card elevation={2} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Aktivitätsübersicht
        </Typography>

        <List sx={{ p: 0 }}>
          {activities.map((activity, index) => (
            <ListItem
              key={index}
              sx={{
                p: 2,
                mb: 1,
                borderRadius: 2,
                border: `1px solid ${alpha(activity.color, 0.2)}`,
                backgroundColor: alpha(activity.color, 0.05),
                '&:last-child': { mb: 0 }
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(activity.color, 0.1),
                    color: activity.color,
                    width: 36,
                    height: 36
                  }}
                >
                  {activity.icon}
                </Avatar>
              </ListItemIcon>

              <ListItemText
                primary={
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {activity.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {activity.description}
                  </Typography>
                }
              />

              <Chip
                label={activity.count}
                size="small"
                sx={{
                  bgcolor: alpha(activity.color, 0.1),
                  color: activity.color,
                  fontWeight: 'bold'
                }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// Helper functions
const getSectionIcon = (sectionName: string) => {
  const name = sectionName.toLowerCase();
  if (name.includes('dividend')) return <Euro sx={{ fontSize: 20 }} />;
  if (name.includes('trade') || name.includes('transak')) return <ShowChart sx={{ fontSize: 20 }} />;
  if (name.includes('performance')) return <TrendingUp sx={{ fontSize: 20 }} />;
  if (name.includes('cash') || name.includes('konto')) return <AccountBalance sx={{ fontSize: 20 }} />;
  return <Assessment sx={{ fontSize: 20 }} />;
};

const getSectionColor = (sectionName: string, theme: any) => {
  const name = sectionName.toLowerCase();
  if (name.includes('dividend')) return theme.palette.success.main;
  if (name.includes('trade') || name.includes('transak')) return theme.palette.primary.main;
  if (name.includes('performance')) return theme.palette.warning.main;
  if (name.includes('cash') || name.includes('konto')) return theme.palette.info.main;
  return theme.palette.secondary.main;
};

export default RecentActivityWidget;
