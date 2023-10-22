import React, { useEffect, useState } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { theme } from '../../theme';
import { useEffect, useState } from 'react';


function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make an API request to fetch the restaurant data
    fetch('https://hc4eabn0s8.execute-api.us-east-1.amazonaws.com/restaurants')
      .then((response) => response.json())
      .then((data) => {
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
    <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="start">
        Restaurant List
    </Flex>

    <div>
      <h1>List of all Restaurant with us:</h1>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.restaurant_id}>
            <Text fontSize="2xl" fontWeight="bold">{restaurant.name}</Text>
            <Text fontSize="lg">{restaurant.address}</Text>
            <Text fontSize="lg">{restaurant.start_time}</Text>
            <Text mt="8px" fontWeight="medium">Opens {restaurant.start_time}</Text>
            <Text fontWeight="medium">Closes {restaurant.end_time}</Text>
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
    </>
  );
}

export default RestaurantList;
