import React from 'react'
import 'leaflet/dist/leaflet.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout';

//Admin Pages
import Dashboard from './pages/admin/Dashboard'
//import AdminBuildings from './pages/admin/AdminBuildings'

// Pages
import Home from './pages/Home'
import Buildings from './pages/Buildings'
import BuildingDetail from './pages/BuildingDetail'
import Locations from './pages/Locations'
import LocationDetail from './pages/LocationDetail'
import Facilities from './pages/Facilities'
//import Facilities from './pages/Facilities'
import FacilityDetail from './pages/FacilityDetail'   //should match the file name in src/pages/FacilityDetail.jsx
import Search from './pages/Search'
import Map from './pages/Map'
import NotFound from './pages/NotFound'
import Rautes from './pages/Routes';

import 'leaflet/dist/leaflet.css';

function App() {
  return (
    
    <Routes>
       {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="buildings" element={<Buildings />} />
        <Route path="buildings/:id" element={<BuildingDetail />} />
        <Route path="locations" element={<Locations />} />
        <Route path="locations/:id" element={<LocationDetail />} />
        <Route path="facilities" element={<Facilities />} />
        <Route path="facilities/:id" element={<FacilityDetail />} />
        <Route path="search" element={<Search />} />
        <Route path="map" element={<Map />} />        
        <Route path="routes" element={<Rautes />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="buildings" element={<Buildings />} />
          <Route path="locations" element={<Locations />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="routes" element={<Routes />} />
          {/* Add more admin routes as needed */}
        </Route>
    </Routes>
  
  );
}

export default App