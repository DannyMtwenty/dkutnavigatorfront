import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
  InputBase,
  Avatar,
  Badge,
  Paper,
  Divider,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  LocalHospital as FacilityIcon,
  Map as MapIcon,
  Search as SearchIcon,
  Route as RouteIcon,
  Event as EventIcon,
  Campaign as AnnouncementIcon,
  Directions as DirectionsIcon,
  NearMe as NearMeIcon,
  Report as ReportIcon,
  Share as ShareIcon,
  LightMode as LightModeIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

const mainMenuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Map', icon: <MapIcon />, path: '/map' },
  { text: 'Buildings', icon: <BusinessIcon />, path: '/buildings' },
  { text: 'Locations', icon: <LocationIcon />, path: '/locations' },
  { text: 'Facilities', icon: <FacilityIcon />, path: '/facilities' },
  { text: 'Routes', icon: <RouteIcon />, path: '/routes' },
  { text: 'Events', icon: <EventIcon />, path: '/events' },
  { text: 'Announcements', icon: <AnnouncementIcon />, path: '/announcements' },
];

const quickActions = [
  { text: 'Get Directions', icon: <DirectionsIcon />, path: '/directions' },
  { text: 'Near Me', icon: <NearMeIcon />, path: '/near-me' },
  { text: 'Report an Issue', icon: <ReportIcon />, path: '/report' },
  { text: 'Share Location', icon: <ShareIcon />, path: '/share' },
];

function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 2.5,
          background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Box
            component="img"
            src="/dkut-logo.png"
            alt="DKUT"
            sx={{ width: 40, height: 40, borderRadius: 1 }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <Typography variant="h6" fontWeight={700}>
            DKUT Navigator
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          Discover. Navigate. Connect.
        </Typography>
      </Box>

      {/* Menu Section */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
        <Typography
          variant="caption"
          sx={{
            px: 2.5,
            mb: 1,
            display: 'block',
            color: 'text.secondary',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          Menu
        </Typography>
        <List>
          {mainMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ px: 1.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Quick Actions */}
        <Typography
          variant="caption"
          sx={{
            px: 2.5,
            mb: 1,
            display: 'block',
            color: 'text.secondary',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          Quick Actions
        </Typography>
        <List>
          {quickActions.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ px: 1.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                }}
              >
                <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Bottom CTA */}
      <Box sx={{ p: 2 }}>
        <Paper
          sx={{
            p: 2,
            background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Box sx={{ mb: 1 }}>
            <MapIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Navigate with ease
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
            Find any place on campus in just a few taps.
          </Typography>
          <Box
            component={Link}
            to="/tour"
            sx={{
              display: 'inline-block',
              px: 2,
              py: 1,
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 2,
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Take a Tour
          </Box>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
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
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>

          {/* Search Bar */}
          <Paper
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              p: '4px 12px',
              display: 'flex',
              alignItems: 'center',
              width: { xs: '100%', sm: 400 },
              bgcolor: 'grey.100',
              boxShadow: 'none',
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 3,
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
              placeholder="Search buildings, facilities, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }}
            />
          </Paper>

          <Box sx={{ flexGrow: 1 }} />

          {/* Right Side Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton sx={{ color: 'text.primary' }}>
              <LightModeIcon />
            </IconButton>
            <IconButton sx={{ color: 'text.primary' }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              DM
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>

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
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

export default MainLayout;