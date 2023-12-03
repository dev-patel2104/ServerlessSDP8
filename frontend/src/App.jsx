import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/UserManagement/Login';
import PartnerLogin from './pages/PartnerManagement/PartnerLogin';
import LandingPage from './pages/LandingPage/LandingPage';
import LayoutWithNav from './pages/Layout/LayoutWithNav';
import LayoutWithoutNav from './pages/Layout/LayoutWithoutNav';
import LoginPage from './pages/CommonPages/LoginPage';
import SignupPage from './pages/CommonPages/SignupPage';
import Profile from './pages/UserManagement/Profile';
import PartnerProfile from './pages/PartnerManagement/PartnerProfile';
import Signup from './pages/UserManagement/Signup';
import PartnerSignup from './pages/PartnerManagement/PartnerSignup';
import ResetPassword from './pages/UserManagement/ResetPassword';
import PartnerResetPassword from './pages/PartnerManagement/PartnerResetPassword';
import BookTable from './pages/BookTable/BookTable';
import RestaurantList from './pages/RestaurantPage/RestaurantList';
import Reservation from './pages/Reservation/Reservation';
import MyReservations from './pages/MyReservations/MyReservations';
import EditReservation from './pages/EditReservation/EditReservation';
import { isAuthenticated } from './services/AuthenticationServices/AuthenticationServices';
import RestaurantDetails from './pages/RestaurantPage/RestaurantDetails';
import EditRestaurantDetails from './pages/RestaurantPage/EditRestaurantDetails';
import PartnerDashboard from './pages/DashBoards/PartnerDashboard';
import MenuItemsReservation from './pages/MenuItemsReservation/MenuItemsReservation';
import PartnerReservations from './pages/MyReservations/PartnerReservations';
import PartnerReservation from './pages/Reservation/PartnerReservation';
import AdminLogin from './pages/AdminPages/AdminLogin';
import AdminResetPassword from './pages/AdminPages/AdminResetPassword';
import AdminProfile from './pages/AdminPages/AdminProfile';
import AdminStatistics from './pages/DashBoards/AdminStatistics';

function App() {
  const router = createBrowserRouter([
    {
      element: <LayoutWithNav />,
      children: [
        {
          path: "/",
          element: <LandingPage />
        },
        {
          path: "/partner/dashboard",
          element: isAuthenticated() === "partner" ? <PartnerDashboard /> : <Navigate to="/partner/login"/>
        },
        {
          path: "/admin/statistics",
          element: isAuthenticated() === "admin" ? <AdminStatistics /> : <Navigate to="/admin/login"/>
        },
        {
          path: "/login",
          element: <LoginPage />
        },
        {
          path: "/signup",
          element: <SignupPage />
        },
        {
          path: "/restaurants",
          element: <RestaurantList />
        },
        {
          path: "/restaurants/:restaurant_id",
          element: <RestaurantDetails />
        },
        {
          path: "/editRestaurants/:restaurant_id",
          element: isAuthenticated() === "partner" ? <EditRestaurantDetails /> : <Navigate to="/partner/login"/>
        },
        {
          path: "/restaurants/:restaurant_id/book",
          element: isAuthenticated() === "user" ? <BookTable /> : <Navigate to="/user/login"/>
        },
        {
          path: "/user/profile",
          element:<Profile/>
        },
        {
          path: "/partner/profile",
          element:<PartnerProfile />
        },
        {
          path: "/reservations/:reservation_id",
          element: isAuthenticated() === "user" ? <Reservation />: <Navigate to="/user/login"/>
        },
        {
          path: "/my-reservations",
          element: isAuthenticated() === "user" ? <MyReservations /> : <Navigate to="/user/login"/>
        },
        {
          path: "/partner/reservations/restaurants/:restaurant_id",
          element: isAuthenticated() === "partner" ? <PartnerReservations /> : <Navigate to="/partner/login"/>
        },
        {
          path: "/partner/reservations/:reservation_id",
          element: isAuthenticated() === "partner" ? <PartnerReservation /> : <Navigate to="/partner/login"/>
        },
        {
          path: "/reservations/:reservation_id/edit",
          element: isAuthenticated() === "user" ? <EditReservation />: <Navigate to="/user/login"/>
        },
        {
          path: "/reservations/:reservation_id/menu-items",
          element: isAuthenticated() === "user" ? <MenuItemsReservation />: <Navigate to="/user/login"/>
        },
        {
          path: "/user/passreset",
          element:<ResetPassword />        
        },
        {
          path: "/partner/passreset",
          element:<PartnerResetPassword />
        },
        {
          path: "/admin/profile",
          element:<AdminProfile />
        },
        {
          path: "/admin/passreset",
          element:<AdminResetPassword />
        },
      ]
    },
    {
      element: <LayoutWithoutNav />,
      children: [
        {
          path: "/user/login",
          element: <Login />
        },
        {
          path: "/partner/login",
          element: <PartnerLogin />
        },
        {
          path: "/user/signup",
          element: <Signup />
        },
        {
          path: "/partner/signup",
          element: <PartnerSignup />
        },
        {
          path: "/admin/login",
          element: <AdminLogin />
        },
      ]
    },
  ]);
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App