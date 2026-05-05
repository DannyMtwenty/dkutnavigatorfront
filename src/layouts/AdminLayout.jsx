import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  alpha,
  useTheme,
  useMediaQuery,
  Collapse,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Business as BuildingIcon,
  LocationOn as LocationIcon,
  LocalHospital as FacilityIcon,
  Route as RouteIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  Map as MapIcon,
  BarChart as AnalyticsIcon,
  Announcement as AnnouncementIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Layers as LayersIcon,
  Assignment as ReportIcon,
  Help as HelpIcon,
  School as AcademicIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

const menuItems = [
  {
    title: 'Overview',
    items: [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
      { text: 'Analytics', icon: <AnalyticsIcon />, path: '/admin/analytics' },
    ],
  },
  {
    title: 'Campus Management',
    items: [
      { text: 'Buildings', icon: <BuildingIcon />, path: '/admin/buildings', badge: '56' },
      { text: 'Locations', icon: <LocationIcon />, path: '/admin/locations', badge: '240' },
      { text: 'Facilities', icon: <FacilityIcon />, path: '/admin/facilities', badge: '45' },
      { text: 'Routes', icon: <RouteIcon />, path: '/admin/routes' },
      { text: 'Floors', icon: <LayersIcon />, path: '/admin/floors' },
    ],
  },
  {
    title: 'Content',
    items: [
      { text: 'Events', icon: <EventIcon />, path: '/admin/events' },
      { text: 'Announcements', icon: <AnnouncementIcon />, path: '/admin/announcements' },
      { text: 'Map Data', icon: <MapIcon />, path: '/admin/map-data' },
    ],
  },
  {
    title: 'System',
    items: [
      { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
      { text: 'Languages', icon: <LanguageIcon />, path: '/admin/languages' },
      { text: 'Reports', icon: <ReportIcon />, path: '/admin/reports' },
      { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
    ],
  },
];

function AdminLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [expandedSections, setExpandedSections] = useState(['Overview', 'Campus Management']);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleSectionToggle = (section) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleLogout = () => {
    // Implement logout logic
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: 'primary.main',
            fontWeight: 700,
            fontSize: '1.25rem',
          }}
        >
          DN
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={700} color="primary">
            DKUT Navigator
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Admin Panel
          </Typography>
        </Box>
      </Box>

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, overflowY: 'auto', px: 2, py: 2 }}>
        {menuItems.map((section) => (
          <Box key={section.title} sx={{ mb: 2 }}>
            <ListItemButton
              onClick={() => handleSectionToggle(section.title)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                py: 0.5,
                px: 2,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    {section.title}
                  </Typography>
                }
              />
              {expandedSections.includes(section.title) ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={expandedSections.includes(section.title)} timeout="auto" unmountOnExit>
              <List disablePadding>
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        onClick={() => handleNavigate(item.path)}
                        sx={{
                          borderRadius: 2,
                          pl: 2,
                          py: 1.25,
                          bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                          color: isActive ? 'primary.main' : 'text.primary',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 40,
                            color: isActive ? 'primary.main' : 'text.secondary',
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={isActive ? 600 : 500}>
                              {item.text}
                            </Typography>
                          }
                        />
                        {item.badge && (
                          <Chip
                            label={item.badge}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              bgcolor: isActive
                                ? 'primary.main'
                                : alpha(theme.palette.primary.main, 0.1),
                              color: isActive ? 'white' : 'primary.main',
                            }}
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>

      {/* Help Section */}
      <Box
        sx={{
          p: 2,
          m: 2,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.1),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <HelpIcon sx={{ fontSize: 20, color: 'primary.main' }} />
          <Typography variant="body2" fontWeight={600}>
            Need Help?
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
          Check our documentation or contact support
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'primary.main',
              cursor: 'pointer',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Docs
          </Typography>
          <Typography variant="caption" color="text.secondary">
            •
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'primary.main',
              cursor: 'pointer',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Support
          </Typography>
        </Box>
      </Box>

      {/* User Section */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.05),
            },
          }}
          onClick={handleProfileMenuOpen}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
            }}
          >
            AD
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              Admin User
            </Typography>
            <Typography variant="caption" color="text.secondary">
              admin@dkut.ac.ke
            </Typography>
          </Box>
          <ExpandMore sx={{ fontSize: 20, color: 'text.secondary' }} />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>

          {/* Page Title */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={600} color="text.primary">
              {location.pathname.split('/').pop().charAt(0).toUpperCase() +
                location.pathname.split('/').pop().slice(1)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Welcome back, Admin
            </Typography>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notifications */}
            <IconButton onClick={handleNotificationOpen} sx={{ color: 'text.primary' }}>
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Profile */}
            <IconButton onClick={handleProfileMenuOpen} sx={{ color: 'text.primary' }}>
              <AccountIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="admin navigation"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Outlet />
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={() => navigate('/admin/profile')}>
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => navigate('/admin/settings')}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>
            <Typography color="error">Logout</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 320,
            maxWidth: 400,
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        <List sx={{ p: 0, maxHeight: 400, overflowY: 'auto' }}>
          {[
            {
              title: 'New Building Added',
              message: 'Science Complex has been added to the system',
              time: '5 min ago',
              unread: true,
            },
            {
              title: 'Route Updated',
              message: 'Main Gate to Library route has been updated',
              time: '1 hour ago',
              unread: true,
            },
            {
              title: 'Facility Maintenance',
              message: 'Cafeteria B will be closed for maintenance',
              time: '2 hours ago',
              unread: false,
            },
            {
              title: 'New Event',
              message: 'Annual Campus Tour scheduled for next week',
              time: '1 day ago',
              unread: false,
            },
          ].map((notification, index) => (
            <React.Fragment key={index}>
              <ListItem
                sx={{
                  bgcolor: notification.unread ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {notification.title}
                      </Typography>
                      {notification.unread && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notification.time}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < 3 && <Divider />}
            </React.Fragment>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 1.5, textAlign: 'center' }}>
          <Typography
            variant="body2"
            color="primary"
            fontWeight={600}
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            View All Notifications
          </Typography>
        </Box>
      </Menu>
    </Box>
  );
}

export default AdminLayout;