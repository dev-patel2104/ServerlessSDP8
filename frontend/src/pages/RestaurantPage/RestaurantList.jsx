import React, { useEffect, useState } from 'react';
import { Flex, Text, Link, Icon, Box } from '@chakra-ui/react';
import { theme } from '../../theme';
import { BsFacebook } from 'react-icons/bs';
import { FaInstagram, FaStaylinked, FaArrowRightLong } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [allOpenRestaurants, setAllOpenRestaurants] = useState([]);
  const [allClosedRestaurants, setAllClosedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentTimeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  
  useEffect(() => {
    // Make an API request to fetch the restaurant data
    fetch('https://hc4eabn0s8.execute-api.us-east-1.amazonaws.com/restaurants')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        const allOpenRestaurants = data.filter((restaurant) => {
          // console.log("currentTimeNow "+currentTimeNow);
          // console.log("restaurant.start_time "+restaurant.start_time);
          // console.log("restaurant.start_time "+restaurant.start_time);
          return currentTimeNow >= restaurant.start_time && currentTimeNow <= restaurant.end_time;
        });
        const allClosedRestaurants = data.filter((restaurant) => {
          return currentTimeNow < restaurant.start_time || currentTimeNow > restaurant.end_time;
        });

        setRestaurants(data);
        setAllOpenRestaurants(allOpenRestaurants);
        setAllClosedRestaurants(allClosedRestaurants);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching restaurant data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Please give us a few minutes fetching the Restaurants...</div>;
  }

  if (restaurants.length === 0) {
    return <div>Oops, Couldn't find any Restaurants. Sorry its on us. Please try again in some time.</div>;
  }


  
  return (
    <>
    <Flex w="100%" minHeight="10vh" p="10px" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="start">
      <Text fontSize="4xl" fontWeight="bold">List of all Restaurant with us:</Text>
    </Flex>
    <Flex w="100%" minHeight="5vh" backgroundColor={theme.primaryBackground} alignItems="start" justifyContent="space-around">
    <Flex flexDirection="column" alignItems="end" >
      {allOpenRestaurants.map((restaurant) => (
        <Box key={restaurant.restaurant_id} w="100%" mt="20px" bg="white" p="20px" rounded="md">
          <NavLink to={`/restaurants/${restaurant.restaurant_id}`}>
            <Text fontSize="2xl" fontWeight="bold">{restaurant.name}</Text>
            <Text fontSize="lg">{restaurant.address}</Text>
            <Text mt="8px" fontWeight="medium">Opens at: {restaurant.start_time}</Text>
            <Text fontWeight="medium">Closes at: {restaurant.end_time}</Text>
            <Text fontSize="lg">{restaurant.tagline}</Text>
            <Text fontSize="lg">Online Delivery: {restaurant.online_delivery ? 'Yes' : 'No'}</Text>
          </NavLink>
          <Text ml="25px">
            <Link href={restaurant.store_link} isExternal display="flex" alignItems="center" align="center">
              <Icon as={FaStaylinked} color='blackAlpha.900' boxSize={6} />
              <Text ml={2}>Restaurant Website</Text>
            </Link>
          </Text>
          <Text ml="25px">
            <Link href={restaurant.fb_link} isExternal display="flex" alignItems="center" align="center">
              <Icon as={BsFacebook} color='blackAlpha.900' boxSize={6} />
              <Text ml={2}>Facebook</Text>
            </Link>
          </Text>
          <Text ml="25px">
            <Link href={restaurant.insta_link} isExternal display="flex" alignItems="center" align="center">
              <Icon as={FaInstagram} color='blackAlpha.900' boxSize={6} />
              <Text ml={2}>Instagram</Text>
            </Link>
          </Text>
          <NavLink to={`/restaurants/${restaurant.restaurant_id}`}>
            <Flex justifyContent="flex-end">
              <Icon as={FaArrowRightLong} color='blackAlpha.900' boxSize={6} ml="auto" />
            </Flex>
          </NavLink>
        </Box>
      ))}

      <Text fontSize="4xl" fontWeight="bold" mt="20px" mb="20px">Currently Closed:</Text>


      {allClosedRestaurants.map((restaurant) => (
        <Box key={restaurant.restaurant_id} w="100%" mt="20px" bg="grey" p="20px" rounded="md">
          <NavLink to={`/restaurants/${restaurant.restaurant_id}`}>
            <Text fontSize="2xl" fontWeight="bold">{restaurant.name}</Text>
            <Text fontSize="lg">{restaurant.address}</Text>
            <Text mt="8px" fontWeight="medium">Opens at: {restaurant.start_time}</Text>
            <Text fontWeight="medium">Closes at: {restaurant.end_time}</Text>
            <Text fontSize="lg">Home Delivery: {restaurant.online_delivery ? 'Yes' : 'No'}</Text>
          </NavLink>
          <Text ml="25px">
            <Link href={restaurant.store_link} isExternal display="flex" alignItems="center" align="center">
              <Icon as={FaStaylinked} color='blackAlpha.900' boxSize={6} />
              <Text ml={2}>Restaurant Website</Text>
            </Link>
          </Text>
          <Text ml="25px">
            <Link href={restaurant.fb_link} isExternal display="flex" alignItems="center" align="center">
              <Icon as={BsFacebook} color='blackAlpha.900' boxSize={6} />
              <Text ml={2}>Facebook</Text>
            </Link>
          </Text>
          <Text ml="25px">
            <Link href={restaurant.insta_link} isExternal display="flex" alignItems="center" align="center">
              <Icon as={FaInstagram} color='blackAlpha.900' boxSize={6} />
              <Text ml={2}>Instagram</Text>
            </Link>
          </Text>
          <NavLink to={`/restaurants/${restaurant.restaurant_id}`}>
            <Flex justifyContent="flex-end">
              <Icon as={FaArrowRightLong} color='blackAlpha.900' boxSize={6} ml="auto" />
            </Flex>
          </NavLink>
        </Box>
      ))}
    </Flex>
    </Flex>
    </>
  );
}

export default RestaurantList;