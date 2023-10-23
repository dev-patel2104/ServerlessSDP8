import React, { useEffect, useState } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { theme } from '../../theme';


function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make an API request to fetch the restaurant data
    fetch('https://hc4eabn0s8.execute-api.us-east-1.amazonaws.com/restaurants')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRestaurants(data);
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
    <Flex w="100%" minHeight="10vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="start">
    <Text fontSize="5xl" fontWeight="bold">List of all Restaurant with us:</Text>
        
    </Flex>
    <Flex w="100%" minHeight="5vh" backgroundColor={theme.primaryBackground} alignItems="start" justifyContent="space-around">
    <Flex flexDirection="column" alignItems="end">
    <div>

      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.restaurant_id}>
            <Text fontSize="2xl" fontWeight="bold">{restaurant.name}</Text>
            <Text fontSize="lg">{restaurant.address}</Text>
            <Text mt="8px" fontWeight="medium">Opens at: {restaurant.start_time}</Text>
            <Text fontWeight="medium">Closes at: {restaurant.end_time}</Text>
            <Text fontSize="lg">{restaurant.tagline}</Text>
            <Text fontSize="lg">Online Delivery: {restaurant.online_delivery ? 'Yes' : 'No'}</Text>
            <a href={restaurant.store_link} target="_blank" rel="noopener noreferrer">
              Visit Restaurant Website
            </a>
            <br />
            <a href={restaurant.fb_link} target="_blank" rel="noopener noreferrer">
              Facebook Page
            </a>
            <br />
            <a href={restaurant.x_link} target="_blank" rel="noopener noreferrer">
              Location on Google Maps
            </a>
          </li>
        ))}
      </ul>
    </div>
    </Flex>
    </Flex>
    </>
  );
}

export default RestaurantList;
