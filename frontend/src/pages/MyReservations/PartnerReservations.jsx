import { CircularProgress, Flex, Text } from '@chakra-ui/react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../theme';
import { useEffect, useState } from 'react';
import { getAllReservationsbyRestaurantID } from '../../services/ReservationServices/ReservationService';
import { useNavigate, useParams } from 'react-router-dom';

function PartnerReservations() {
    const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });
    const { restaurant_id } = useParams();
    const [loading, setLoading] = useState("false");
    const [reservations, setReservations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading("true");
            const reservationResponse = await getAllReservationsbyRestaurantID(restaurant_id);
            setReservations(reservationResponse);
            setLoading("false");
        }
        fetchData();
    }, []);

    return (
        isMobile ?
            <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="start">
                Mobile Landing Page
            </Flex>
            :
            loading === "false" ?
                <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} alignItems="start" justifyContent="center">
                    <Flex w="1080px" flexDir="column" mt="16px" gap="16px">
                        <Text mb="8px" fontSize="2xl" fontWeight="medium">Reservations</Text>
                        {
                            reservations.map((reservation, ind) =>
                                <button onClick={() => navigate(`/partner/reservations/${reservation.reservation_id}`)}>
                                    <Flex flexDirection="column" alignItems="center" border="2px" p="24px" borderRadius="8px">
                                        <Text fontWeight="medium">Reservation on {new Date(reservation.reservation_time).toLocaleString()} by {reservation.customer_id}</Text>
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

export default PartnerReservations;