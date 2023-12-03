import { Flex, Text, Button, Image, CircularProgress, useToast } from '@chakra-ui/react';
import { useMediaQuery } from 'react-responsive';
import { theme } from '../../theme';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { deleteReservation, getReservation } from '../../services/ReservationServices/ReservationService';
import logo from "../../assets/food-color-sushi-svgrepo-com.svg";
import { getRestaurant } from '../../services/RestaurantServices/RestaurantService';
import { editItems, getItemsReservationID } from '../../services/ReservationServices/MenuReservationService';



function MenuItemsReservation() {
    const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });
    const { reservation_id } = useParams();
    const [loading, setLoading] = useState("false");
    const [reservation, setReservation] = useState({});
    const [reservationDate, setReservationDate] = useState(new Date());
    const [restaurant, setRestaurant] = useState({});
    const [items, setItems] = useState([]);
    const [menuReservation, setMenuReservation] = useState({});
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
            const itemsResponse = await getItemsReservationID(reservation_id);
            setItems(itemsResponse.items);
            setMenuReservation(itemsResponse);
            setLoading("false");
        }
        fetchData();
    }, []);


    const addQuantity = (itemInput) => {

        setItems(items =>
            items.map(item => {
                if (item.item_id === itemInput.item_id) {
                    return {
                        ...item, item_quantity: item.item_quantity + 1, item_qty: item.item_qty - 1
                    };
                }
                return item;
            })
        );

    }

    const removeQuantity = (itemInput) => {
        setItems(items =>
            items.map(item => {
                if (item.item_id === itemInput.item_id) {
                    return {
                        ...item, item_quantity: item.item_quantity - 1, item_qty: item.item_qty + 1
                    };
                }
                return item;
            })
        );
    }

    const updateItems = async () => {
        const updateResponse = await editItems(restaurant.restaurant_id, reservation_id, items);

        if (updateResponse.reservation_id) {
            toast({
                title: 'Update Successful',
                description: "Your menu items have been updated!",
                status: 'success',
                duration: 3000, // Duration in milliseconds
                isClosable: true,
            });

            navigate(`/reservations/${reservation_id}`);
        } else {
            toast({
                title: 'Update error',
                description: "We could not update you menu items!",
                status: 'error',
                duration: 3000, // Duration in milliseconds
                isClosable: true,
            });
        }
    }

    return (
        isMobile ?
            loading === "false" ?
                <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="start">
                    <Flex w="90%" flexDirection="column" alignItems="start">
                        <Image src={logo} boxSize="256px" alt={restaurant.name} />
                        <Text fontSize="2xl" fontWeight="bold">{restaurant.name}</Text>
                        <Text fontSize="lg">{restaurant.address}</Text>
                        <Text mt="8px" fontWeight="medium">Opens {restaurant.start_time}</Text>
                        <Text fontWeight="medium">Closes {restaurant.end_time}</Text>
                    </Flex>
                    <Flex w="90%" flexDir="column">
                        <Text mt="16px" fontSize="2xl" fontWeight="medium">Have a great experience!</Text>
                        <Text mt="8px" fontWeight="medium">Reservation Time:</Text>
                        <Text fontWeight="medium">{reservationDate.toLocaleString()}</Text>

                        <Text mt="32px" fontSize="xl" fontWeight="medium">Add menu items: </Text>
                        <Flex mt="24px" flexDirection="column" gap="16px">
                            {
                                items.map((item, ind) =>
                                    <Flex key={ind} gap="24px" alignItems="center">
                                        <Image src={`https://foodvaganza.s3.amazonaws.com/${restaurant.restaurant_id}/${item.item_image_path}`} w="128px" h="128px"></Image>

                                        <Flex flexDir="column" justifyContent="center" alignItems="center">
                                            <Text mb="8px">{item.item_name}</Text>
                                            <Flex gap="16px">
                                                <Text>Quantity ordered: {item.item_quantity}</Text>
                                                <Text>Quantity remaining: {item.item_qty}</Text>
                                            </Flex>
                                            <Flex gap="8px">
                                                {
                                                    item.item_qty > 0 ? <Button onClick={() => addQuantity(item)} mt="16px" variant="solid" w="128px" _hover={{ backgroundColor: theme.accent, opacity: 0.8 }} backgroundColor={theme.accent} color={theme.primaryForeground}>Add</Button>
                                                        : null
                                                }
                                                {
                                                    item.item_quantity > 0 ? <Button onClick={() => removeQuantity(item)} mt="16px" variant="solid" w="128px" _hover={{ backgroundColor: theme.accent, opacity: 0.8 }} backgroundColor={theme.accent} color={theme.primaryForeground}>Remove</Button>
                                                        : null
                                                }
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                )
                            }
                        </Flex>
                        <Button onClick={updateItems} mt="64px" variant="solid" w="128px" _hover={{ backgroundColor: theme.accent, opacity: 0.8 }} backgroundColor={theme.accent} color={theme.primaryForeground}>Save</Button>
                    </Flex>
                </Flex> :
                <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="center">
                    <CircularProgress isIndeterminate color="teal" />
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

                        <Text mt="32px" fontSize="xl" fontWeight="medium">Add menu items: </Text>
                        <Flex mt="24px" flexDirection="column" gap="16px">
                            {
                                items.map((item, ind) =>
                                    <Flex key={ind} gap="128px" alignItems="center">
                                        <Image src={`https://foodvaganza.s3.amazonaws.com/${restaurant.restaurant_id}/${item.item_image_path}`} w="128px" h="128px"></Image>

                                        <Flex flexDir="column" justifyContent="center" alignItems="center">
                                            <Text mb="8px">{item.item_name}</Text>
                                            <Flex gap="16px">
                                                <Text>Quantity ordered: {item.item_quantity}</Text>
                                                <Text>Quantity remaining: {item.item_qty}</Text>
                                            </Flex>
                                            <Flex gap="16px">
                                                {
                                                    item.item_qty > 0 ? <Button onClick={() => addQuantity(item)} mt="16px" variant="solid" w="128px" _hover={{ backgroundColor: theme.accent, opacity: 0.8 }} backgroundColor={theme.accent} color={theme.primaryForeground}>Add</Button>
                                                        : null
                                                }
                                                {
                                                    item.item_quantity > 0 ? <Button onClick={() => removeQuantity(item)} mt="16px" variant="solid" w="128px" _hover={{ backgroundColor: theme.accent, opacity: 0.8 }} backgroundColor={theme.accent} color={theme.primaryForeground}>Remove</Button>
                                                        : null
                                                }
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                )
                            }
                        </Flex>
                        <Button onClick={updateItems} mt="64px" variant="solid" w="128px" _hover={{ backgroundColor: theme.accent, opacity: 0.8 }} backgroundColor={theme.accent} color={theme.primaryForeground}>Save</Button>
                    </Flex>
                </Flex> :
                <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="center">
                    <CircularProgress isIndeterminate color="teal" />
                </Flex>
    );
}

export default MenuItemsReservation;