import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import SiteLayout from '@/components/layout/SiteLayout';
import Spinner from '@/components/ui/Spinner';
import { ADMIN_PATH } from '@/config/site';
import BlogIndex from '@/pages/blog/BlogIndex';
import BlogPost from '@/pages/blog/BlogPost';
import About from '@/pages/company/About';
import Careers from '@/pages/company/Careers';
import Mission from '@/pages/company/Mission';
import Partnerships from '@/pages/company/Partnerships';
import Sustainability from '@/pages/company/Sustainability';
import Home from '@/pages/Home';
import Faqs from '@/pages/how-it-works/Faqs';
import Guide from '@/pages/how-it-works/Guide';
import HowToJoin from '@/pages/how-it-works/HowToJoin';
import SafetyTips from '@/pages/how-it-works/SafetyTips';
import NotFound from '@/pages/NotFound';
import CampusDetail from '@/pages/products/CampusDetail';
import Download from '@/pages/products/Download';
import EBikeFeatures from '@/pages/products/EBikeFeatures';
import Locations from '@/pages/products/Locations';
import Pricing from '@/pages/products/Pricing';
import ServicePage from '@/pages/products/ServicePage';
import BrandGuidelines from '@/pages/support/BrandGuidelines';
import Contact from '@/pages/support/Contact';
import Credits from '@/pages/support/Credits';
import Privacy from '@/pages/support/Privacy';
import SafetyGuidelines from '@/pages/support/SafetyGuidelines';
import Sitemap from '@/pages/support/Sitemap';
import SupportCenter from '@/pages/support/SupportCenter';
import Terms from '@/pages/support/Terms';

// The admin panel is loaded separately so public visitors never download it.
const AdminApp = lazy(() => import('@/admin/AdminApp'));

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />

        {/* Products */}
        <Route path="/products/e-bikes" element={<EBikeFeatures />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/locations/:slug" element={<CampusDetail />} />
        <Route path="/download" element={<Download />} />
        <Route path="/services/:slug" element={<ServicePage />} />

        {/* How it works */}
        <Route path="/how-it-works" element={<Guide />} />
        <Route path="/safety" element={<SafetyTips />} />
        <Route path="/faq" element={<Faqs />} />
        <Route path="/join" element={<HowToJoin />} />

        {/* Company */}
        <Route path="/about" element={<About />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/partnerships" element={<Partnerships />} />

        {/* Help & Support */}
        <Route path="/support" element={<SupportCenter />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/brand" element={<BrandGuidelines />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/sitemap" element={<Sitemap />} />

        {/* Blog */}
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/category/:slug" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path={`${ADMIN_PATH}/*`}
        element={
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center bg-surface-muted">
                <Spinner className="h-6 w-6" />
              </div>
            }
          >
            <AdminApp />
          </Suspense>
        }
      />
    </Routes>
  );
}
