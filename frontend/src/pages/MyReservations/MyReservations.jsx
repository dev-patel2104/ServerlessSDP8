import { CircularProgress, Flex, Text } from '@chakra-ui/react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../theme';
import { useEffect, useState } from 'react';
import { getAllReservationsbyCustomerID } from '../../services/ReservationServices/ReservationService';
import { useNavigate } from 'react-router-dom';

function MyReservations() {
    const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });
    const customer_id = localStorage.getItem("foodvaganzaUser");
    const [loading, setLoading] = useState("false");
    const [reservations, setReservations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading("true");
            const reservationResponse = await getAllReservationsbyCustomerID(customer_id);
            setReservations(reservationResponse);
            setLoading("false");
        }
        fetchData();
    }, []);

    return (
        isMobile ?
            <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="start">
                <Flex w="90%" flexDir="column" mt="16px" gap="16px">
                        <Text mb="8px" fontSize="2xl" fontWeight="medium">My reservations</Text>
                        {
                            reservations.map((reservation, ind) =>
                                <button onClick={() => navigate(`/reservations/${reservation.reservation_id}`)}>
                                    <Flex flexDirection="column" alignItems="center" border="2px" p="24px" borderRadius="8px">
                                        <Text fontWeight="medium">Your reservation on {new Date(reservation.reservation_time).toLocaleString()}</Text>
                                    </Flex>
                                </button>)
                        }
                    </Flex>
            </Flex>
            :
            loading === "false" ?
                <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} alignItems="start" justifyContent="center">
                    <Flex w="1080px" flexDir="column" mt="16px" gap="16px">
                        <Text mb="8px" fontSize="2xl" fontWeight="medium">My reservations</Text>
                        {
                            reservations.map((reservation, ind) =>
                                <button onClick={() => navigate(`/reservations/${reservation.reservation_id}`)}>
                                    <Flex flexDirection="column" alignItems="center" border="2px" p="24px" borderRadius="8px">
                                        <Text fontWeight="medium">Your reservation on {new Date(reservation.reservation_time).toLocaleString()}</Text>
                                    </Flex>
                                </button>)
                        }
                    </Flex>
                </Flex> :
                <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="center">
                    <CircularProgress isIndeterminate color="teal" />
                </Flex>
    );
}

export default MyReservations;