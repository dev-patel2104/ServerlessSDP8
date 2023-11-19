import { React, useEffect, useState } from "react";
import { Flex, Text, Badge, CircularProgress } from "@chakra-ui/react";
import { useMediaQuery } from "react-responsive";
import { theme } from "../../theme";
import { getAllReservationsForPartner } from "../../services/DashboardServices/DashboardServices";

function PartnerDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState("false");

  useEffect(() => {
    const fetchData = async () => {
      setLoading("true");
      const reservationResponse = await getAllReservationsForPartner();
      setData(reservationResponse);
      setLoading("false");
    }
    fetchData();
  }, []);

  // Filter reservations for today, this week, and this month
  const todayReservations = data.filter((reservation) => {
    const reservationDate = new Date(reservation.dateTime);
    const today = new Date();
    return (
      reservationDate.getFullYear() === today.getFullYear() &&
      reservationDate.getMonth() === today.getMonth() &&
      reservationDate.getDate() === today.getDate()
    );
  });

  const thisWeekReservations = data.filter((reservation) => {
    const reservationDate = new Date(reservation.dateTime);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return reservationDate >= today && reservationDate <= nextWeek;
  });

  const thisMonthReservations = data.filter((reservation) => {
    const reservationDate = new Date(reservation.dateTime);
    const today = new Date();
    return (
      reservationDate.getFullYear() === today.getFullYear() &&
      reservationDate.getMonth() === today.getMonth()
    );
  });


  const convertToDateTime = (dateTime) => new Date(dateTime);

  // Sort reservations by both date and time
  const sortReservations = (reservations) => {
    return reservations.sort((a, b) => {
      const dateA = convertToDateTime(a.dateTime);
      const dateB = convertToDateTime(b.dateTime);

      // Sort by date first
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;

      // If dates are equal, sort by time
      if (dateA.getTime() === dateB.getTime()) {
        const timeA = dateA.getHours() * 60 + dateA.getMinutes();
        const timeB = dateB.getHours() * 60 + dateB.getMinutes();
        return timeA - timeB;
      }
      return 0;
    });
  };

  const sortedTodayReservations = sortReservations(todayReservations);
  const sortedThisWeekReservations = sortReservations(thisWeekReservations);
  const sortedThisMonthReservations = sortReservations(thisMonthReservations);

  const renderCount = (filteredData) => {
    return (
      <Flex alignItems="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold" mr={2}>
          Count:
        </Text>
        <Badge colorScheme="green">{filteredData.length}</Badge>
      </Flex>
    );
  };

  const isMobile = useMediaQuery({ query: "(max-width: 1080px)" });

  const [currentTab, setCurrentTab] = useState("today");

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  return isMobile ? (
    <Flex
      w="100%"
      minHeight="90vh"
      backgroundColor={theme.primaryBackground}
      flexDir="column"
      alignItems="center"
      justifyContent="start"
    >
      Mobile Landing Page
    </Flex>
  ) : (

    loading === "false" ?
      <Flex
        w="100%"
        minHeight="90vh"
        backgroundColor={theme.primaryBackground}
        alignItems="center"
        justifyContent="space-evenly"
        flexDir="column"
      >
        <Flex mb={4}>
          <Text
            onClick={() => handleTabChange("today")}
            cursor="pointer"
            fontWeight={currentTab === "today" ? "bold" : "normal"}
            mr={4}
          >
            Today
          </Text>
          <Text
            onClick={() => handleTabChange("thisWeek")}
            cursor="pointer"
            fontWeight={currentTab === "thisWeek" ? "bold" : "normal"}
            mr={4}
          >
            This Week
          </Text>
          <Text
            onClick={() => handleTabChange("thisMonth")}
            cursor="pointer"
            fontWeight={currentTab === "thisMonth" ? "bold" : "normal"}
          >
            This Month
          </Text>
        </Flex>

        <Flex flexDir="column">
          {currentTab === "today" && renderCount(sortedTodayReservations)}
          {currentTab === "today" &&
            sortedTodayReservations.map((reservation) => (
              // Render your data as needed
              <Text
                key={reservation.id}
                color={theme.primaryForeground}
                fontWeight="bold"
              >
                {reservation.customerName} - {new Date(reservation.dateTime).toLocaleString()}
              </Text>
            ))}

          {currentTab === "thisWeek" && renderCount(sortedThisWeekReservations)}
          {currentTab === "thisWeek" &&
            sortedThisWeekReservations.map((reservation) => (
              // Render your data as needed
              <Text
                key={reservation.id}
                color={theme.primaryForeground}
                fontWeight="bold"
              >
                {reservation.customerName} - {new Date(reservation.dateTime).toLocaleString()}
              </Text>
            ))}

          {currentTab === "thisMonth" && renderCount(sortedThisMonthReservations)}
          {currentTab === "thisMonth" &&
            sortedThisMonthReservations.map((reservation) => (
              // Render your data as needed
              <Text
                key={reservation.id}
                color={theme.primaryForeground}
                fontWeight="bold"
              >
                {reservation.customerName} - {new Date(reservation.dateTime).toLocaleString()}
              </Text>
            ))}
        </Flex>
      </Flex> : <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="center">
        <CircularProgress isIndeterminate color="teal" />
      </Flex>
  );
}

export default PartnerDashboard;