import React, { useEffect, useState } from 'react';
import { Flex, Text, Link, Icon, Box, VStack, HStack, Image, Button } from '@chakra-ui/react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { BsFacebook, BsArrowLeft, BsFillHouseSlashFill, BsFillBagCheckFill, BsFillBagXFill, BsFillHouseHeartFill, BsTelephoneFill } from 'react-icons/bs';
import { FaInstagram, FaLink, FaMapMarkedAlt, FaClock } from 'react-icons/fa';
import { getRestaurant } from '../../services/RestaurantServices/RestaurantService';
import { theme } from '../../theme';

function RestaurantDetails() {
  const { restaurant_id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`restaurant_id = ${restaurant_id}`);
    const fetchData = async () => {
        const restaurantResponse = await getRestaurant(restaurant_id);
        setRestaurant(restaurantResponse);
        console.log(restaurantResponse);
        setLoading(false);
    }
    fetchData();
  }, [restaurant_id]);

  if (loading) {
    return <div>Loading restaurant details...</div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found.</div>;
  }

  return (
    <Flex flexDirection="column" alignItems="start" justifyContent="center">
        <Box bg="white" w="100%"  rounded="md" mb="5px">
            <Image src={`https://foodvaganza.s3.amazonaws.com/${restaurant_id}/${restaurant.image_path}`}  w="100%" h="200px"  objectFit="cover" />
        </Box>
        <Flex flexDirection="column" alignItems="start" justifyContent="space-between">
        <Box bg="white" w="100%" mr="45%" ml="45%" rounded="md" >
            <Text fontSize="4xl" p="20px" fontWeight="bold">{restaurant.name}</Text>
            <Box bg="white" p="20px" ml="40px" rounded="md">
                <Text p="5px" fontSize="lg">{restaurant.tagline}</Text>
                <Text p="5px" fontSize="lg"> <Icon as={FaMapMarkedAlt} color='blackAlpha.900' boxSize={6} /> {restaurant.address} </Text>
                <Text p="5px" fontWeight="medium"> <Icon as={BsTelephoneFill} color='blackAlpha.900' boxSize={6} /> {restaurant.contact} </Text>
                <Text p="5px" fontWeight="medium"> <Icon as={FaClock} color='rgb(0 205 106)' boxSize={6} /> Opens at: {restaurant.start_time} </Text>
                <Text p="5px" fontWeight="medium"> <Icon as={FaClock} color='red' boxSize={6} /> Closes at: {restaurant.end_time} </Text>

                <Flex align="center">
                    <Text p="5px" fontSize="lg" fontWeight="medium">Home Delivery:</Text>
                    <Text ml="15px">
                        {restaurant.online_delivery ? ( <> <Icon as={BsFillHouseHeartFill} color='green' boxSize={6} /> Provided </> ) : ( <> <Icon as={BsFillHouseSlashFill} color='red' boxSize={6} />  Not Provided </> )}
                    </Text>
                </Flex>

                {restaurant.store_link && (
                    <Link href={restaurant.store_link} isExternal p="10px" display="flex" alignItems="center">
                    <Icon as={FaLink} color='#78C257' boxSize={6} />
                    <Text ml={2} color="#0244A1">Restaurant Homepage</Text>
                    </Link>
                )}
                {restaurant.fb_link && (
                    <Link href={restaurant.fb_link} isExternal p="10px" display="flex" alignItems="center">
                    <Icon as={BsFacebook} color='#4267B2' boxSize={6} />
                    <Text ml={2} color="#0244A1">Facebook</Text>
                    </Link>
                )}
                {restaurant.insta_link && (
                    <Link href={restaurant.insta_link} isExternal p="10px" display="flex" alignItems="center">
                        <Icon as={FaInstagram} color='blackAlpha.900' boxSize={6} />
                        <Text ml={2} color="#0244A1">Instagram</Text>
                    </Link>
                )}

                <Button mt="15px" colorScheme='purple' onClick={() => navigate(`/restaurants/${restaurant_id}/book`)}>Reserve your Table</Button>

            </Box>
            <Text fontSize="4xl" p="20px" fontWeight="bold">Our Menu Items</Text>
            <VStack alignItems="start" spacing="20px" ml="60px" >
                {restaurant.menu.map((menuItem) => (
                    <Box key={menuItem.item_id} bg="white" p="20px" rounded="md" w="100%" border="1px solid #ccc">
                        <Image src={`https://foodvaganza.s3.amazonaws.com/${restaurant_id}/${menuItem.item_image_path}`} alt={menuItem.item_name} w="100%" h="200px" objectFit="cover" />
                        <Text fontSize="lg" fontWeight="bold"> {menuItem.item_name} </Text>
                        <Text fontSize="md">{menuItem.item_description}</Text>
                        <Text fontWeight="medium">Category: {menuItem.category}</Text>
                        {menuItem.item_type && (
                            <Text fontWeight="medium">Type: {menuItem.item_type}</Text>
                        )}
                        {menuItem.is_available ? (
                                <>  <Text fontSize="lg" color="green.500"> <Icon as={BsFillBagCheckFill} color='green' boxSize={6} /> Available </Text> </>
                             ) : ( 
                                <> <Text fontSize="lg" color="red.500"> <Icon as={BsFillBagXFill} color='red' boxSize={6} />  Not Available </Text> </>
                            )}
                        <HStack mt="10px" spacing="10px">
                            {menuItem.item_size_price.map((sizePrice) => (
                            <Box key={sizePrice.size} bg="gray.100" p="10px" rounded="md">
                                <Text fontSize="lg" fontWeight="bold"> {sizePrice.size} </Text>
                                <Text>{`$${sizePrice.price.toFixed(2)}${sizePrice.type ? ` per ${sizePrice.type}` : ''}`}</Text>
                            </Box>
                            ))}
                        </HStack>
                    </Box>
                ))}
            </VStack>
            </Box>


            <Box ml="auto" mt="20px">
                <NavLink to="/restaurants" p="20px">
                    <Icon as={BsArrowLeft} color='blackAlpha.900' boxSize={6} /> Back to Restaurant List
                </NavLink>
            </Box>
        <Box mt="50px" h="150px">

        </Box>
    </Flex> 
    </Flex>
  );
}

export default RestaurantDetails;
