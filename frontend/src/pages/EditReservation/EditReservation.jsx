import { Flex, Text, Image, Button, CircularProgress, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../theme';
import logo from "../../assets/food-color-sushi-svgrepo-com.svg";
import { useNavigate, useParams } from 'react-router-dom';
import { editReservation, getReservation } from '../../services/ReservationServices/ReservationService';

function EditReservation() {
    const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });
    const [daysArray, setDaysArray] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState("false");
    const [slotLoading, setSlotLoading] = useState("false");
    const [selectedDay, setSelectedDay] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState(0);
    const { reservation_id } = useParams();
    const [reservation, setReservation] = useState({});
    const customer_id = "2";
    const toast = useToast();
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchData = async () => {
            setLoading("true");
            const reservationResponse = await getReservation(reservation_id);
            setReservation(reservationResponse);
            setLoading("false");
        }
        fetchData();
        loadDays();
        loadSlots(0);

    }, []);

    const loadDays = () => {
        setLoading("true");
        const currentDate = new Date();
        const next5Days = [];
        for (let i = 0; i < 5; i++) {
            const date = new Date(currentDate);

            date.setDate(currentDate.getDate() + i);

            next5Days.push({
                date: date.toDateString().split(" ")[1] + " " + date.toDateString().split(" ")[2],
                day: date.toDateString().split(" ")[0],
                fullDate: date
            });
        }
        setDaysArray(next5Days);
        setLoading("false");
    }

    const loadSlots = (num) => {
        setSlotLoading("true");
        const currentDate = new Date();
        let startTime = Number(restaurant.start_time.split(":")[0]);
        if (num === 0 && startTime < Number(currentDate.getHours())) {
            startTime = Number(currentDate.getHours()) + 1;
        }
        let endTime = Number(restaurant.end_time.split(":")[0]);
        let slotTimeMinutes = restaurant.start_time.split(":")[1];
        let slotTime = startTime;
        let slotsArray = [];

        while (slotTime < endTime) {
            slotsArray.push({
                hours: slotTime,
                minutes: slotTimeMinutes
            });
            slotTime += 1;
        }
        setSlots(slotsArray);
        setSlotLoading("false");
    }

    const handleDayClick = (ind) => {
        setSelectedDay(ind);
        loadSlots(ind);
    }

    const editCurrentReservation = async () => {
        let reservation_date = daysArray[selectedDay].fullDate;
        reservation_date.setHours(slots[selectedSlot].hours);
        reservation_date.setMinutes(Number(slots[selectedSlot].minutes));
        reservation_date.setSeconds(0);

        let reservation_time = reservation_date.getTime();
        let reservation_status = "confirmed";
        const reservationResponse = await editReservation(reservation_id, reservation.restaurant_id, reservation_time, customer_id, reservation_status);

        if (reservationResponse.reservation_id) {
            toast({
                title: 'Reservation Successfully changed',
                description: "Your table has been booked!",
                status: 'success',
                duration: 3000, // Duration in milliseconds
                isClosable: true,
            });

            navigate(`/reservations/${reservationResponse.reservation_id}`);
        } else {
            toast({
                title: 'Reservation error',
                description: "We could not change your booking!",
                status: 'error',
                duration: 3000, // Duration in milliseconds
                isClosable: true,
            });
        }

    }

    return (
        isMobile ?
            <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="start">
                Mobile Landing Page
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
                        <Text mt="16px" fontSize="2xl" fontWeight="medium">Last minute changes?</Text>
                        <Text fontWeight="medium">Select date:</Text>
                        <Flex wrap="wrap" w="60%" gap="16px" rowGap="8px" mt="8px">
                            {
                                daysArray.map((day, ind) =>
                                    selectedDay === ind ?
                                        <button onClick={() => handleDayClick(ind)}>
                                            <Flex flexDirection="column" alignItems="center" border="2px" p="6px" borderRadius="8px" backgroundColor={theme.accent}>
                                                <Text fontWeight="medium">{day.day}</Text>
                                                <Text fontWeight="medium">{day.date}</Text>
                                            </Flex>
                                        </button> :
                                        <button onClick={() => handleDayClick(ind)}>
                                            <Flex flexDirection="column" alignItems="center">
                                                <Text>{day.day}</Text>
                                                <Text>{day.date}</Text>
                                            </Flex>
                                        </button>)
                            }
                        </Flex>

                        <Text fontWeight="medium" mt="16px">Select time:</Text>
                        {slotLoading === "false" ?
                            <Flex wrap="wrap" w="60%" gap="16px" rowGap="8px" mt="8px">
                                {
                                    slots.map((slot, ind) =>
                                        selectedSlot === ind ?
                                            <button onClick={() => setSelectedSlot(ind)}>
                                                <Flex flexDirection="column" alignItems="center" border="2px" p="6px" borderRadius="8px" backgroundColor={theme.accent}>
                                                    <Text fontWeight="medium">{slot.hours}:{slot.minutes}</Text>
                                                </Flex>
                                            </button> :
                                            <button onClick={() => setSelectedSlot(ind)}>
                                                <Flex flexDirection="column" alignItems="center">
                                                    <Text>{slot.hours}:{slot.minutes}</Text>
                                                </Flex>
                                            </button>)
                                }
                            </Flex> :
                            <Flex w="60%" gap="16px" rowGap="8px" mt="8px">
                                <CircularProgress isIndeterminate color="teal" />
                            </Flex>
                        }
                        <Button onClick={editCurrentReservation} mt="32px" variant="solid" w="128px" _hover={{ backgroundColor: theme.accent, opacity: 0.8 }} backgroundColor={theme.accent} color={theme.primaryForeground}>Save changes</Button>
                    </Flex>
                </Flex> :
                <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="center">
                    <CircularProgress isIndeterminate color="teal" />
                </Flex>
    );
}

export default EditReservation;