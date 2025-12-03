import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import ListingDetailsPage from './pages/ListingDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import TripsPage from './pages/TripsPage';
import WishlistsPage from './pages/WishlistsPage';
import AccountPage from './pages/AccountPage';
import HelpCenterPage from './pages/HelpCenterPage';
import ExperiencesPage from './pages/ExperiencesPage';
import ExperienceDetailsPage from './pages/ExperienceDetailsPage';
import TravelPackagesPage from './pages/TravelPackagesPage';
import PackageDetailsPage from './pages/PackageDetailsPage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailsPage from './pages/DestinationDetailsPage';
import GuidesPage from './pages/GuidesPage';
import GuideDetailsPage from './pages/GuideDetailsPage';
import PlacesPage from './pages/PlacesPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminListings from './pages/admin/AdminListings';
import AdminBookings from './pages/admin/AdminBookings';
import AdminExperiences from './pages/admin/AdminExperiences';
import AdminReviews from './pages/admin/AdminReviews';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="experiences" element={<ExperiencesPage />} />
          <Route path="experiences/:id" element={<ExperienceDetailsPage />} />
          <Route path="listings/:id" element={<ListingDetailsPage />} />
          <Route path="trips" element={<TripsPage />} />
          <Route path="wishlists" element={<WishlistsPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="help" element={<HelpCenterPage />} />
          <Route path="search" element={<SearchResultsPage />} />

          {/* Places Section */}
          <Route path="places" element={<PlacesPage />}>
            <Route path="destinations" element={<DestinationsPage />} />
            <Route path="packages" element={<TravelPackagesPage />} />
            <Route path="guides" element={<GuidesPage />} />
          </Route>

          {/* Detail Pages (Top Level) */}
          <Route path="packages/:id" element={<PackageDetailsPage />} />
          <Route path="destinations/:id" element={<DestinationDetailsPage />} />
          <Route path="guides/:id" element={<GuideDetailsPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="listings" element={<AdminListings />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="experiences" element={<AdminExperiences />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
