import React, { useEffect, useState } from 'react';
import { Flex, Text, Link, Icon, Box, VStack, HStack, Image } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { BsFacebook, BsArrowRight } from 'react-icons/bs';
import { FaInstagram, FaLink } from 'react-icons/fa';
import { theme } from '../../theme';

function RestaurantDetails() {
  const { restaurantID } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`restaurantID = ${restaurantID}`);
    fetch(`https://hc4eabn0s8.execute-api.us-east-1.amazonaws.com/restaurants/${restaurantID}`)
      .then((response) => response.json())
      .then((data) => {
        setRestaurant(data);
        console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching restaurant details:', error);
        setLoading(false);
      });
  }, [restaurantID]);

  if (loading) {
    return <div>Loading restaurant details...</div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found.</div>;
  }

  return (
    <Flex flexDirection="column" alignItems="start" justifyContent="space-between">
        <Box bg="white" p="20px" rounded="md" mb="20px">
            <Image src={`https://foodvaganza.s3.amazonaws.com/${restaurant.image_path}`} w="100%" h="200px" objectFit="cover" />
        </Box>
        <Flex flexDirection="column" alignItems="start" justifyContent="space-between">
        <Box bg="white" p="20px" rounded="md">
            <Text fontSize="2xl" fontWeight="bold">{restaurant.name}</Text>
            <Text fontSize="lg">{restaurant.address}</Text>
            <Text fontWeight="medium">Opens at: {restaurant.start_time}</Text>
            <Text fontWeight="medium">Closes at: {restaurant.end_time}</Text>
            <Text fontSize="lg">{restaurant.tagline}</Text>
            <Text fontSize="lg">Online Delivery: {restaurant.online_delivery ? 'Yes' : 'No'}</Text>
            <Link href={restaurant.store_link} isExternal display="flex" alignItems="center">
            <Icon as={FaLink} color='blackAlpha.900' boxSize={6} />
            <Text ml={2}>Restaurant Website</Text>
            </Link>
            <Link href={restaurant.fb_link} isExternal display="flex" alignItems="center">
            <Icon as={BsFacebook} color='blackAlpha.900' boxSize={6} />
            <Text ml={2}>Facebook</Text>
            </Link>
            {restaurant.insta_link && (
            <Link href={restaurant.insta_link} isExternal display="flex" alignItems="center">
                <Icon as={FaInstagram} color='blackAlpha.900' boxSize={6} />
                <Text ml={2}>Instagram</Text>
            </Link>
            )}
        </Box>
        <Text fontSize="xl" fontWeight="bold" mt="20px">
            Menu
        </Text>
        <VStack alignItems="start" spacing="10px">
            {restaurant.menu.map((menuItem) => (
            <Box key={menuItem.item_id} bg="white" p="20px" rounded="md" w="100%">
                <Image src={menuItem.item_image_path} alt={menuItem.item_name} boxSize="100px" objectFit="cover" />
                <Text fontSize="lg" fontWeight="bold">
                {menuItem.item_name}
                </Text>
                <Text fontSize="md">{menuItem.item_description}</Text>
                <Text fontWeight="medium">Category: {menuItem.category}</Text>
                <Text fontWeight="medium">Type: {menuItem.item_type}</Text>
                {menuItem.is_available ? (
                <Text fontSize="lg" color="green.500">
                    Available
                </Text>
                ) : (
                <Text fontSize="lg" color="red.500">
                    Not Available
                </Text>
                )}
                <HStack mt="10px" spacing="10px">
                {menuItem.item_size_price.map((sizePrice) => (
                    <Box key={sizePrice.size}>
                    <Text fontSize="lg" fontWeight="bold">
                        {sizePrice.size}
                    </Text>
                    <Text>{`$${sizePrice.price.toFixed(2)} per ${sizePrice.type}`}</Text>
                    </Box>
                ))}
                </HStack>
            </Box>
            ))}
        </VStack>
        <Link to="/restaurants" as={BsArrowRight} color='blackAlpha.900' boxSize={6} mt="20px">
            Back to Restaurant List
        </Link>
    </Flex> 
    </Flex>
  );
}

export default RestaurantDetails;
