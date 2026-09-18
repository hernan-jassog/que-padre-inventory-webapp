import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/Login/LoginPage';
import { MainLayout } from '../layout/MainLayout';
import { PrivateRoute } from './PrivateRoute';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { UserManagementPage } from '../pages/Admin/UserManagementPage';
import { InventoryPage } from '../pages/Inventory/InventoryPage';
import { PurchasesPage } from '../pages/Purchases/PurchasesPage';
import { CatalogPage } from '../pages/Catalog/CatalogPage';
import { SalesDeductionPage } from '../pages/Sales/SalesDeductionPage';
import { PhysicalAdjustmentPage } from '../pages/Adjustments/PhysicalAdjustmentPage';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/purchases" element={<PurchasesPage />} />
            <Route path="/sales" element={<SalesDeductionPage />} />
            <Route path="/adjustments" element={<PhysicalAdjustmentPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
