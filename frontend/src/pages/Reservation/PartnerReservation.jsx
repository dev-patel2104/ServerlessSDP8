import { Flex, Text, Button, Image, CircularProgress, useToast } from '@chakra-ui/react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../theme';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { deleteReservation, editReservation, getReservation } from '../../services/ReservationServices/ReservationService';
import logo from "../../assets/food-color-sushi-svgrepo-com.svg";
import { getRestaurant } from '../../services/RestaurantServices/RestaurantService';
import { deleteItems } from '../../services/ReservationServices/MenuReservationService';



function PartnerReservation() {
    const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });
    const { reservation_id } = useParams();
    const [loading, setLoading] = useState("false");
    const [reservation, setReservation] = useState({});
    const [reservationDate, setReservationDate] = useState(new Date());
    const [restaurant, setRestaurant] = useState({});
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading("true");
            const reservationResponse = await getReservation(reservation_id);
            setReservation(reservationResponse);
            const restaurantResponse = await getRestaurant(reservationResponse?.restaurant_id);
            setRestaurant(restaurantResponse);
            setReservationDate(new Date(reservationResponse.reservation_time));
            setLoading("false");
        }
        fetchData();
    }, []);


    const handleDelete = async () => {
        const deleteResponse = await deleteReservation(reservation_id);
        const deleteMenuItems = await deleteItems(reservation_id);
        if (deleteResponse.reservation_id) {
            toast({
                title: 'Reservation Successfully Deleted',
                description: "Hope to see you again!",
                status: 'success',
                duration: 3000, // Duration in milliseconds
                isClosable: true,
            });

            navigate(`/partner/reservations/restaurants/${reservation.restaurant_id}`);
        } else {
            toast({
                title: 'Reservation deletion error',
                description: "We could not delete your booking!",
                status: 'error',
                duration: 3000, // Duration in milliseconds
                isClosable: true,
            });
        }
    }

    const handleApprove = async () => {
        const aprroveResponse = await editReservation(reservation.reservation_id, reservation.restaurant_id, reservation.reservation_time, reservation.customer_id, "confirmed", reservation.is_notified, reservation.is_);
      
        if (aprroveResponse.reservation_id) {
            toast({
                title: 'Reservation Successfully Approved',
                description: "Please serve the customer accordingly!",
                status: 'success',
                duration: 3000, // Duration in milliseconds
                isClosable: true,
            });

            navigate(`/partner/reservations/restaurants/${reservation.restaurant_id}`);
        } else {
            toast({
                title: 'Reservation deletion error',
                description: "We could not delete this booking!",
                status: 'error',
                duration: 3000, // Duration in milliseconds
                isClosable: true,
            });
        }
    }


    return (
        isMobile ?
            <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="start">
                Reservation Page
            </Flex>
            :
            loading === "false" ?
                <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} alignItems="start" justifyContent="space-around">
                    <Flex w="26%" flexDirection="column" alignItems="end">
                        <Image src={logo} boxSize="256px" alt={restaurant.name} />
                        <Text fontSize="2xl" fontWeight="bold">{restaurant.name}</Text>
                        <Text fontSize="lg">{restaurant.address}</Text>
                        <Text mt="8px" fontWeight="medium">Opens {restaurant.start_time}</Text>
                        <Text fontWeight="medium">Closes {restaurant.end_time}</Text>
                    </Flex>
                    <Flex w="69%" flexDir="column">
                        <Text mt="16px" fontSize="2xl" fontWeight="medium">Reservation Details:</Text>
                        <Text mt="8px" fontWeight="medium">Customer: {reservation.customer_id}</Text>
                        <Text mt="8px" fontWeight="medium">Reservation Time:</Text>
                        <Text fontWeight="medium">{reservationDate.toLocaleString()}</Text>

                        <Flex gap="16px" alignItems="center">
                            {
                                reservationDate.getTime() - new Date().getTime() > 3600000 ?
                                    reservation.reservation_status === "confirmed"? <Text mt="8px" fontWeight="medium">Approved</Text>:
                                    <Button onClick={handleApprove} mt="16px" variant="solid" w="128px" _hover={{ backgroundColor: theme.accent, opacity: 0.8 }} backgroundColor={theme.accent} color={theme.primaryForeground}>Approve</Button>
                                    : null
                            }
                            {
                                reservationDate.getTime() - new Date().getTime() > 3600000 ?
                                    <Button onClick={handleDelete} mt="16px" variant="solid" w="128px" _hover={{ backgroundColor: theme.accent, opacity: 0.8 }} backgroundColor={theme.accent} color={theme.primaryForeground}>Delete</Button>
                                    : null
                            }

                        </Flex>
                    </Flex>
                </Flex> :
                <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="center">
                    <CircularProgress isIndeterminate color="teal" />
                </Flex>
    );
}

export default PartnerReservation;