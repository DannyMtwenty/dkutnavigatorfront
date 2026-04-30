import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Drawer,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Button,
  Stack,
  Card,
  CardContent,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  MyLocation as MyLocationIcon,
  Layers as LayersIcon,
  Close as CloseIcon,
  Directions as DirectionsIcon,
  Business as BuildingIcon,
  School as AcademicIcon,
  AdminPanelSettings as AdminIcon,
  Home as HostelIcon,
  Restaurant as DiningIcon,
  LocalHospital as HealthIcon,
  LocalParking as ParkingIcon,
  DirectionsBus as BusIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  CenterFocusStrong as CenterIcon,
} from '@mui/icons-material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useBuildings } from '../hooks/useBuildings';
import { useLocations } from '../hooks/useLocations';

// Custom marker icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const categoryIcons = {
  Academic: { color: '#2196F3', icon: <AcademicIcon /> },
  Administration: { color: '#9C27B0', icon: <AdminIcon /> },
  Hostel: { color: '#E91E63', icon: <HostelIcon /> },
  Dining: { color: '#FF9800', icon: <DiningIcon /> },
  Health: { color: '#F44336', icon: <HealthIcon /> },
  Parking: { color: '#607D8B', icon: <ParkingIcon /> },
  'Bus Stop': { color: '#00BCD4', icon: <BusIcon /> },
};

function Map() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [layersOpen, setLayersOpen] = useState(false);
  const [visibleLayers, setVisibleLayers] = useState({
    Academic: true,
    Administration: true,
    Hostel: true,
    Dining: true,
    Health: true,
    Parking: true,
    'Bus Stop': false,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [showDirections, setShowDirections] = useState(false);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeLineRef = useRef(null);

  const { data: buildings = [] } = useBuildings();
  const { data: locations = [] } = useLocations();

  // Default center (DKUT coordinates)
  const defaultCenter = [-0.4175, 36.95];

  // Initialize map
  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false,
      }).setView(defaultCenter, 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Add user location if available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Add markers
  useEffect(() => {
    if (!mapInstanceRef.current || buildings.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add building markers
    buildings.forEach((building) => {
      const category = 'Academic'; // You should get this from building data
      if (!visibleLayers[category]) return;

      const color = categoryIcons[category]?.color || '#4CAF50';
      const marker = L.marker([building.latitude, building.longitude], {
        icon: createCustomIcon(color),
      })
        .addTo(mapInstanceRef.current)
        .bindPopup(
          `
          <div style="padding: 8px; min-width: 200px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <div style="
                background-color: ${alpha(color, 0.15)};
                color: ${color};
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
              ">
                ${category}
              </div>
            </div>
            <strong style="font-size: 14px;">${building.buildingName}</strong><br/>
            <small style="color: #757575;">Code: ${building.buildingCode || 'N/A'}</small><br/>
            <small style="color: #757575;">${building.floorsCount} Floors</small>
            <div style="margin-top: 12px; display: flex; gap: 8px;">
              <button 
                onclick="window.viewBuilding(${building.buildingId})"
                style="
                  flex: 1;
                  padding: 6px 12px;
                  background-color: #1B5E20;
                  color: white;
                  border: none;
                  border-radius: 6px;
                  cursor: pointer;
                  font-size: 12px;
                  font-weight: 600;
                "
              >
                View Details
              </button>
              <button 
                onclick="window.getDirections(${building.latitude}, ${building.longitude})"
                style="
                  flex: 1;
                  padding: 6px 12px;
                  background-color: white;
                  color: #1B5E20;
                  border: 1px solid #1B5E20;
                  border-radius: 6px;
                  cursor: pointer;
                  font-size: 12px;
                  font-weight: 600;
                "
              >
                Directions
              </button>
            </div>
          </div>
        `,
          { maxWidth: 300 }
        );

      marker.on('click', () => {
        setSelectedLocation(building);
      });

      markersRef.current.push(marker);
    });
  }, [buildings, visibleLayers]);

  // Map controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(defaultCenter, 16);
    }
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        setUserLocation(coords);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(coords, 17);
          L.marker(coords, {
            icon: L.divIcon({
              className: 'user-location-marker',
              html: '<div style="width: 16px; height: 16px; background: #2196F3; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            }),
          }).addTo(mapInstanceRef.current);
        }
      });
    }
  };

  const handleLayerToggle = (layer) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const filteredBuildings = buildings.filter((building) =>
    building.buildingName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', gap: 2, position: 'relative' }}>
      {/* Left Sidebar - Search & List */}
      <Paper
        elevation={0}
        sx={{
          width: 380,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {/* Search Header */}
        <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Campus Map
          </Typography>
          <TextField
            fullWidth
            placeholder="Search buildings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                bgcolor: 'grey.50',
              },
            }}
          />
        </Box>

        {/* Building List */}
        <List sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
          {filteredBuildings.map((building) => (
            <ListItem key={building.buildingId} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  setSelectedLocation(building);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([building.latitude, building.longitude], 18);
                  }
                }}
                sx={{
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: alpha('#1B5E20', 0.05),
                  },
                }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: alpha('#2196F3', 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2196F3',
                    }}
                  >
                    <BuildingIcon />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={600}>
                      {building.buildingName}
                    </Typography>
                  }
                  secondary={
                    <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                      <Chip
                        label="Academic"
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                          bgcolor: alpha('#2196F3', 0.1),
                          color: '#2196F3',
                        }}
                      />
                      <Chip
                        label="120m"
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Stack>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Tip Section */}
        <Paper
          elevation={0}
          sx={{
            m: 2,
            p: 2,
            bgcolor: alpha('#4CAF50', 0.1),
            borderLeft: '3px solid',
            borderColor: 'success.main',
            borderRadius: 2,
          }}
        >
          <Typography variant="caption" fontWeight={600} color="success.dark" display="block" mb={0.5}>
            💡 Tip
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Long press on the map to set your starting location and get directions to any building.
          </Typography>
        </Paper>
      </Paper>

      {/* Map Container */}
      <Box sx={{ flexGrow: 1, position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
        <Box
          ref={mapRef}
          sx={{
            width: '100%',
            height: '100%',
            bgcolor: 'grey.100',
            '& .leaflet-container': {
              height: '100%',
              borderRadius: 2,
            },
          }}
        />

        {/* Map Controls */}
        <Stack
          spacing={1}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Tooltip title="Zoom In" placement="left">
            <Paper
              onClick={handleZoomIn}
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              <ZoomInIcon />
            </Paper>
          </Tooltip>

          <Tooltip title="Zoom Out" placement="left">
            <Paper
              onClick={handleZoomOut}
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              <ZoomOutIcon />
            </Paper>
          </Tooltip>

          <Tooltip title="Recenter" placement="left">
            <Paper
              onClick={handleRecenter}
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              <CenterIcon />
            </Paper>
          </Tooltip>

          <Tooltip title="My Location" placement="left">
            <Paper
              onClick={handleMyLocation}
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <MyLocationIcon />
            </Paper>
          </Tooltip>

          <Tooltip title="Layers" placement="left">
            <Paper
              onClick={() => setLayersOpen(true)}
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              <LayersIcon />
            </Paper>
          </Tooltip>
        </Stack>

        {/* Selected Location Card */}
        {selectedLocation && (
          <Card
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              maxWidth: 400,
              zIndex: 1000,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Box>
                  <Chip
                    label="Academic"
                    size="small"
                    sx={{
                      mb: 1,
                      bgcolor: alpha('#2196F3', 0.1),
                      color: '#2196F3',
                      fontWeight: 600,
                    }}
                  />
                  <Typography variant="h6" fontWeight={700}>
                    {selectedLocation.buildingName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Code: {selectedLocation.buildingCode} • {selectedLocation.floorsCount} Floors
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => setSelectedLocation(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<DirectionsIcon />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Get Directions
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  View on Map
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Layers Drawer */}
      <Drawer
        anchor="right"
        open={layersOpen}
        onClose={() => setLayersOpen(false)}
        PaperProps={{
          sx: { width: 320 },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              Show on Map
            </Typography>
            <IconButton size="small" onClick={() => setLayersOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <FormGroup>
            {Object.keys(categoryIcons).map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={visibleLayers[category]}
                    onChange={() => handleLayerToggle(category)}
                    sx={{
                      color: categoryIcons[category].color,
                      '&.Mui-checked': {
                        color: categoryIcons[category].color,
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: categoryIcons[category].color }}>
                      {categoryIcons[category].icon}
                    </Box>
                    <Typography variant="body2" fontWeight={500}>
                      {category}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </Box>
      </Drawer>
    </Box>
  );
}

export default Map;