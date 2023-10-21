import { Flex, Text, Button, Image, CircularProgress, useToast } from '@chakra-ui/react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../theme';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { deleteReservation, getReservation } from '../../services/ReservationServices/ReservationService';
import logo from "../../assets/food-color-sushi-svgrepo-com.svg";


function Reservation() {
    const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });
    const { reservation_id } = useParams();
    const [loading, setLoading] = useState("false");
    const [reservation, setReservation] = useState({});
    const [reservationDate, setReservationDate] = useState(new Date());
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading("true");
            const reservationResponse = await getReservation(reservation_id);
            setReservation(reservationResponse);
            setReservationDate(new Date(reservationResponse.reservation_time));
            setLoading("false");
        }
        fetchData();
    }, []);

    const restaurant = {
        "restaurant_id": "1",
        "address": "1707 Grafton St, Halifax, NS",
        "contact": 9021234567,
        "end_time": "21:00",
        "fb_link": "https://www.facebook.com/woodenmonkey",
        "image_path": "woodenmonkey.jpg",
        "max_booking_capacity": 60,
        "menu": [
            {
                "category": "Salads",
                "is_available": true,
                "item_description": "Fresh organic spinach with a balsamic vinaigrette dressing.",
                "item_id": "101",
                "item_image_path": "spinach_salad.jpg",
                "item_name": "Organic Spinach Salad",
                "item_size_price": [
                    {
                        "price": 8.99,
                        "size": "Small",
                        "type": "pcs"
                    },
                    {
                        "price": 12.99,
                        "size": "Regular",
                        "type": "pcs"
                    }
                ],
                "item_type": "vegetarian"
            }
        ],
        "name": "The Wooden Monkey",
        "online_delivery": true,
        "start_time": "11:00",
        "store_link": "https://www.woodenmonkey.com",
        "tagline": "Local, Organic, Sustainable",
        "x_link": "https://www.google.com/maps/woodenmonkey"
    }

    const handleDelete = async () => {
        const deleteResponse = await deleteReservation(reservation_id);
        if (deleteResponse.reservation_id) {
            toast({
                title: 'Reservation Successfully Deleted',
                description: "Hope to see you again!",
                status: 'success',
                duration: 3000, // Duration in milliseconds
                isClosable: true,
            });

            navigate(`/my-reservations`);
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
                        <Text mt="16px" fontSize="2xl" fontWeight="medium">Have a great experience!</Text>
                        <Text mt="8px" fontWeight="medium">Reservation Time:</Text>
                        <Text fontWeight="medium">{reservationDate.toLocaleString()}</Text>

                        <Flex gap="16px">
                            {
                                reservationDate.getTime() - new Date().getTime() > 360000 ?
                                    <Button onClick={() => navigate(`edit`)} mt="16px" variant="solid" w="128px" _hover={{ backgroundColor: theme.accent, opacity: 0.8 }} backgroundColor={theme.accent} color={theme.primaryForeground}>Edit</Button>
                                    : null
                            }
                            <Button onClick={handleDelete} mt="16px" variant="solid" w="128px" _hover={{ backgroundColor: theme.accent, opacity: 0.8 }} backgroundColor={theme.accent} color={theme.primaryForeground}>Delete</Button>
                        </Flex>
                    </Flex>
                </Flex> :
                <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="center">
                    <CircularProgress isIndeterminate color="teal" />
                </Flex>
    );
}

export default Reservation;