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
import MenuItemsReservation from './pages/MenuItemsReservation/MenuItemsReservation';
import PartnerReservations from './pages/MyReservations/PartnerReservations';
import PartnerReservation from './pages/Reservation/PartnerReservation';

function App() {

  // const [loggedIn, setLoggedIn] = useState(null);

  const router = createBrowserRouter([
    {
      element: <LayoutWithNav />,
      children: [
        {
          path: "/",
          element: <LandingPage />
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
          element: isAuthenticated() ? <EditRestaurantDetails /> : <Navigate to="/user/login"/>
        },
        {
          path: "/restaurants/:restaurant_id/book",
          element: isAuthenticated() ? <BookTable /> : <Navigate to="/user/login"/>
        },
        {
          path: "/user/profile",
          element: <Profile/>
        },
        {
          path: "/partner/profile",
          element: <PartnerProfile />
        },
        {
          path: "/reservations/:reservation_id",
          element: isAuthenticated() ? <Reservation />: <Navigate to="/user/login"/>
        },
        {
          path: "/my-reservations",
          element: isAuthenticated() ? <MyReservations /> : <Navigate to="/user/login"/>
        },
        {
          path: "/partner/reservations/restaurants/:restaurant_id",
          element: isAuthenticated() ? <PartnerReservations /> : <Navigate to="/partner/login"/>
        },
        {
          path: "/partner/reservations/:reservation_id",
          element: isAuthenticated() ? <PartnerReservation /> : <Navigate to="/partner/login"/>
        },
        {
          path: "/reservations/:reservation_id/edit",
          element: isAuthenticated() ? <EditReservation />: <Navigate to="/user/login"/>
        },
        {
          path: "/reservations/:reservation_id/menu-items",
          element: isAuthenticated() ? <MenuItemsReservation />: <Navigate to="/user/login"/>
        },
        {
          path: "/user/passreset",
          element:<ResetPassword />        
        },
        {
          path: "/partner/passreset",
          element:<PartnerResetPassword />
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
        }
      ]
    },
  ]);

  // useEffect(() => {
  //   const listen = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setLoggedIn(user);
  //     } else {
  //       setLoggedIn(null);
  //     }
  //   });

  //   return () => {
  //     listen();
  //   };
  // }, []);

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App