import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

// Pages
import Home from './pages/Home'
import Buildings from './pages/Buildings'
import BuildingDetail from './pages/BuildingDetail'
import Locations from './pages/Locations'
import LocationDetail from './pages/LocationDetail'
import Facilities from './pages/Facilities'
import Search from './pages/Search'
import Map from './pages/Map'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="buildings" element={<Buildings />} />
        <Route path="buildings/:id" element={<BuildingDetail />} />
        <Route path="locations" element={<Locations />} />
        <Route path="locations/:id" element={<LocationDetail />} />
        <Route path="facilities" element={<Facilities />} />
        <Route path="search" element={<Search />} />
        <Route path="map" element={<Map />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App