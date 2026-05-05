import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  LinearProgress,
  Stack,
  alpha,
  Avatar,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Business as BuildingIcon,
  LocationOn as LocationIcon,
  LocalHospital as FacilityIcon,
  People as PeopleIcon,
  Route as RouteIcon,
  Event as EventIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const statsCards = [
  {
    title: 'Total Buildings',
    value: '56',
    change: '+5.2%',
    trend: 'up',
    icon: <BuildingIcon sx={{ fontSize: 32 }} />,
    color: '#2196F3',
    bgColor: '#E3F2FD',
  },
  {
    title: 'Active Locations',
    value: '240',
    change: '+12.3%',
    trend: 'up',
    icon: <LocationIcon sx={{ fontSize: 32 }} />,
    color: '#4CAF50',
    bgColor: '#E8F5E9',
  },
  {
    title: 'Facilities',
    value: '45',
    change: '-2.1%',
    trend: 'down',
    icon: <FacilityIcon sx={{ fontSize: 32 }} />,
    color: '#FF9800',
    bgColor: '#FFF3E0',
  },
  {
    title: 'Daily Users',
    value: '1,234',
    change: '+8.7%',
    trend: 'up',
    icon: <PeopleIcon sx={{ fontSize: 32 }} />,
    color: '#9C27B0',
    bgColor: '#F3E5F5',
  },
];

const usageData = [
  { name: 'Mon', users: 400, routes: 240 },
  { name: 'Tue', users: 300, routes: 139 },
  { name: 'Wed', users: 200, routes: 980 },
  { name: 'Thu', users: 278, routes: 390 },
  { name: 'Fri', users: 189, routes: 480 },
  { name: 'Sat', users: 239, routes: 380 },
  { name: 'Sun', users: 349, routes: 430 },
];

const locationTypeData = [
  { name: 'Classrooms', value: 85, color: '#2196F3' },
  { name: 'Labs', value: 42, color: '#4CAF50' },
  { name: 'Offices', value: 38, color: '#FF9800' },
  { name: 'Others', value: 75, color: '#9C27B0' },
];

function Dashboard() {
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and manage your campus navigation system
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: stat.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Chip
                    icon={
                      stat.trend === 'up' ? (
                        <ArrowUpIcon sx={{ fontSize: 16 }} />
                      ) : (
                        <ArrowDownIcon sx={{ fontSize: 16 }} />
                      )
                    }
                    label={stat.change}
                    size="small"
                    sx={{
                      bgcolor: stat.trend === 'up' ? alpha('#4CAF50', 0.1) : alpha('#F44336', 0.1),
                      color: stat.trend === 'up' ? '#4CAF50' : '#F44336',
                      fontWeight: 600,
                      border: 'none',
                    }}
                  />
                </Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Usage Chart */}
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              height: '100%',
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Weekly Usage Statistics
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Users and route calculations over the past week
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9e9e9e" />
                <YAxis stroke="#9e9e9e" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#2196F3"
                  strokeWidth={3}
                  dot={{ fill: '#2196F3', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="routes"
                  stroke="#4CAF50"
                  strokeWidth={3}
                  dot={{ fill: '#4CAF50', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Location Types */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              height: '100%',
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Location Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Breakdown by location type
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={locationTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {locationTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Stack spacing={1.5} sx={{ mt: 3 }}>
              {locationTypeData.map((item, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: 1,
                        bgcolor: item.color,
                      }}
                    />
                    <Typography variant="body2" fontWeight={500}>
                      {item.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent Activity
            </Typography>
            <Stack spacing={2} sx={{ mt: 3 }}>
              {[
                {
                  action: 'New building added',
                  description: 'Science Complex added to the system',
                  time: '5 minutes ago',
                  icon: <BuildingIcon />,
                  color: '#2196F3',
                },
                {
                  action: 'Route updated',
                  description: 'Main Gate to Library route modified',
                  time: '1 hour ago',
                  icon: <RouteIcon />,
                  color: '#4CAF50',
                },
                {
                  action: 'Facility maintenance',
                  description: 'Cafeteria B marked for maintenance',
                  time: '2 hours ago',
                  icon: <FacilityIcon />,
                  color: '#FF9800',
                },
                {
                  action: 'Event scheduled',
                  description: 'Campus tour event created',
                  time: '1 day ago',
                  icon: <EventIcon />,
                  color: '#9C27B0',
                },
              ].map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: 'grey.50',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha(activity.color, 0.1),
                      color: activity.color,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {activity.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {activity.action}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} lg={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              System Health
            </Typography>
            <Stack spacing={3} sx={{ mt: 3 }}>
              {[
                { label: 'Database Status', value: 98, color: '#4CAF50' },
                { label: 'API Response Time', value: 85, color: '#2196F3' },
                { label: 'Map Data Accuracy', value: 92, color: '#FF9800' },
                { label: 'User Satisfaction', value: 88, color: '#9C27B0' },
              ].map((stat, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {stat.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color={stat.color}>
                      {stat.value}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={stat.value}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha(stat.color, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: stat.color,
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;