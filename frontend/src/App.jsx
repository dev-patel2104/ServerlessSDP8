import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './pages/UserManagement/Login';
import LandingPage from './pages/LandingPage/LandingPage';
import LayoutWithNav from './pages/Layout/LayoutWithNav';
import LayoutWithoutNav from './pages/Layout/LayoutWithoutNav';
import Profile from './pages/UserManagement/Profile';
import Signup from './pages/UserManagement/Signup';
import BookTable from './pages/BookTable/BookTable';
import RestaurantList from './pages/RestaurantPage/RestaurantList';
import Reservation from './pages/Reservation/Reservation';
import MyReservations from './pages/MyReservations/MyReservations';
import EditReservation from './pages/EditReservation/EditReservation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { isAuthenticated } from './services/AuthenticationServices/AuthenticationServices';
import RestaurantDetails from './pages/RestaurantPage/RestaurantDetails';

function App() {

  const [loggedIn, setLoggedIn] = useState(null);

  const router = createBrowserRouter([
    {
      element: <LayoutWithNav />,
      children: [
        {
          path: "/",
          element: <LandingPage />
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
          path: "/restaurants/:restaurant_id/book",
          element: isAuthenticated() ? <BookTable /> : <Navigate to="/user/login"/>
        },
        {
          path: "/user/profile",
          element: isAuthenticated() ? <Profile /> : <Navigate to="/user/login"/>
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
          path: "/reservations/:reservation_id/edit",
          element: isAuthenticated() ? <EditReservation />: <Navigate to="/user/login"/>
        }

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
          path: "/user/signup",
          element: <Signup />
        }
      ]
    },
  ]);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(user);
      } else {
        setLoggedIn(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
