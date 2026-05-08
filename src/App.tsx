/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "@/src/views/landing/LandingPage";
import { CatalogPage } from "@/src/views/catalog/CatalogPage";
import { DashboardLayout } from "@/src/views/dashboard/DashboardLayout";
import { Overview } from "@/src/views/dashboard/Overview";
import { Inbox } from "@/src/views/dashboard/Inbox";
import { AgentCustomize } from "@/src/views/dashboard/AgentCustomize";
import { DeveloperLayout } from "@/src/views/developer/DeveloperLayout";
import { DevOverview } from "@/src/views/developer/DevOverview";
import { AgentCreator } from "@/src/views/developer/AgentCreator";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        
        {/* Client Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout><Overview /></DashboardLayout>} />
        <Route path="/dashboard/inbox" element={<DashboardLayout><Inbox /></DashboardLayout>} />
        <Route path="/dashboard/agents/:id/customize" element={<DashboardLayout><AgentCustomize /></DashboardLayout>} />

        {/* Developer Dashboard */}
        <Route path="/developer" element={<DeveloperLayout><DevOverview /></DeveloperLayout>} />
        <Route path="/developer/create" element={<DeveloperLayout><AgentCreator /></DeveloperLayout>} />
      </Routes>
    </Router>
  );
}
