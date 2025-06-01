import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TeamManagement from '../pages/admin/TeamManagement';

const AdminRoutes = () => {
  return (
    <Routes>
      {/* ...existing routes */}
      <Route path="/team" element={<TeamManagement />} />
    </Routes>
  );
};

export default AdminRoutes;