import React, { useEffect, useState } from 'react';
import { Flex, Text, Link, Icon, Box } from '@chakra-ui/react';
import { theme } from '../../theme';
import { BsFacebook, BsFillHouseSlashFill, BsFillHouseHeartFill } from 'react-icons/bs';
import { FaInstagram, FaStaylinked, FaArrowRightLong } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
import { getAllRestaurants } from '../../services/RestaurantServices/RestaurantService';
import { isAuthenticated } from "../../services/AuthenticationServices/AuthenticationServices";

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [allOpenRestaurants, setAllOpenRestaurants] = useState([]);
  const [allClosedRestaurants, setAllClosedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentTimeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  
  useEffect(() => {
    
    const fetchData = async () => {
      let restaurantResponse = null;
      if (localStorage.getItem("userType") === "partner") {
        // get restaurant by emailid
      }
      else {
        // get all restaurants
      }
      restaurantResponse = await getAllRestaurants();
      const allOpenRestaurants = restaurantResponse.filter((restaurant) => {
        return currentTimeNow >= restaurant.start_time && currentTimeNow <= restaurant.end_time && restaurant.is_open === true;
      });
      console.log('allOpenRestaurants : ',allOpenRestaurants)
      const allClosedRestaurants = restaurantResponse.filter((restaurant) => {
        return currentTimeNow < restaurant.start_time || currentTimeNow > restaurant.end_time || restaurant.is_open === false;
      });
      console.log('allClosedRestaurants : ',allClosedRestaurants)
      console.log(restaurants);
      setRestaurants(restaurantResponse);
      setAllOpenRestaurants(allOpenRestaurants);
      setAllClosedRestaurants(allClosedRestaurants);
      setLoading(false);
    }
    fetchData();
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
      {isAuthenticated() ? ( 
        <Text fontSize="4xl" fontWeight="bold">My Restaurants:</Text>
      ) : ( 
        <Text fontSize="4xl" fontWeight="bold">List of all Restaurant with us:</Text>
      )} 
    </Flex>
    <Flex w="100%" minHeight="5vh" backgroundColor={theme.primaryBackground} alignItems="start" justifyContent="space-around">
    
    { !isAuthenticated() ? ( 

      <Flex flexDirection="column" alignItems="end" >
        {allOpenRestaurants.map((restaurant) => (
          <Box key={restaurant.restaurant_id} boxShadow='xl' w="100%" mt="20px" bg="#FCFAFA" p="20px" rounded="md">
            <NavLink to={`/restaurants/${restaurant.restaurant_id}`}>
              <Text fontSize="2xl" fontWeight="bold">{restaurant.name}</Text>
              <Text fontSize="lg" color="#8A8896">{restaurant.address}</Text>
              <Text mt="8px" fontWeight="medium">Opens at: {restaurant.start_time}</Text>
              <Text fontWeight="medium">Closes at: {restaurant.end_time}</Text>
              <Text fontSize="lg" as="em">{restaurant.tagline}</Text>
              <Text fontSize="lg">Online Delivery: {restaurant.online_delivery ? ( <> <Icon as={BsFillHouseHeartFill} color='green' boxSize={6} /></>):(<><Icon as={BsFillHouseSlashFill} color='red' boxSize={6} /></>)} {restaurant.online_delivery ? 'Yes' : 'No'} </Text>
              <Text ml="15px">
                
              </Text>
            </NavLink>
            <Text ml="25px" mt="10px" color="#0244A1">
              <Link href={restaurant.store_link} isExternal display="flex" alignItems="center" align="center">
                <Icon as={FaStaylinked} color='#78C257' boxSize={6} />
                <Text ml={2}>Restaurant Website</Text>
              </Link>
            </Text>
            <Text ml="25px" mt="10px" color="#0244A1">
              <Link href={restaurant.fb_link} isExternal display="flex" alignItems="center" align="center">
                <Icon as={BsFacebook} color='#4267B2' boxSize={6} />
                <Text ml={2}>Facebook</Text>
              </Link>
            </Text>
            <Text ml="25px" mt="10px" color="#0244A1">
              <Link href={restaurant.insta_link} isExternal display="flex" alignItems="center" align="center">
                <Icon as={FaInstagram} color='#E1306C' boxSize={6} />
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
          <Box key={restaurant.restaurant_id} boxShadow='xl' w="100%" mt="20px" bg="#F2D5F8" p="20px" rounded="md">
            <NavLink to={`/restaurants/${restaurant.restaurant_id}`}>
              <Text fontSize="2xl" fontWeight="bold">{restaurant.name}</Text>
              <Text fontSize="lg" color="#6B6977">{restaurant.address}</Text>
              <Text mt="8px" fontWeight="medium">Opens at: {restaurant.start_time}</Text>
              <Text fontWeight="medium">Closes at: {restaurant.end_time}</Text>
              <Text fontSize="lg" as="em">{restaurant.tagline}</Text>
              <Text fontSize="lg">Online Delivery: {restaurant.online_delivery ? ( <> <Icon as={BsFillHouseHeartFill} color='green' boxSize={6} /></>):(<><Icon as={BsFillHouseSlashFill} color='red' boxSize={6} /></>)} {restaurant.online_delivery ? 'Yes' : 'No'} </Text>
            </NavLink>
            <Text ml="25px" mt="10px" color="#0244A1">
              <Link href={restaurant.store_link} isExternal display="flex" alignItems="center" align="center">
                <Icon as={FaStaylinked} color='#78C257' boxSize={6} />
                <Text ml={2}>Restaurant Website</Text>
              </Link>
            </Text>
            <Text ml="25px" mt="10px" color="#0244A1">
              <Link href={restaurant.fb_link} isExternal display="flex" alignItems="center" align="center">
                <Icon as={BsFacebook} color='#4267B2' boxSize={6} />
                <Text ml={2}>Facebook</Text>
              </Link>
            </Text>
            <Text ml="25px" mt="10px" color="#0244A1">
              <Link href={restaurant.insta_link} isExternal display="flex" alignItems="center" align="center">
                <Icon as={FaInstagram} color='#E1306C' boxSize={6} />
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
    
    ) : (
      <Flex flexDirection="column" alignItems="end" >
        {restaurants.filter((restaurant_detail, index) => restaurant_detail.email_id === localStorage.getItem('foodvaganzaPartner')).map((restaurant) => (
          <Box key={restaurant.restaurant_id} boxShadow='xl' w="100%" mt="20px" bg="#FCFAFA" p="20px" rounded="md">
          <NavLink to={`/editRestaurants/${restaurant.restaurant_id}`}>
            <Text fontSize="2xl" fontWeight="bold">{restaurant.name}</Text>
            <Text fontSize="lg" color="#8A8896">{restaurant.address}</Text>
            <Text mt="8px" fontWeight="medium">Opens at: {restaurant.start_time}</Text>
            <Text fontWeight="medium">Closes at: {restaurant.end_time}</Text>
            <Text fontSize="lg" as="em">{restaurant.tagline}</Text>
            <Text fontSize="lg">Online Delivery: {restaurant.online_delivery ? ( <> <Icon as={BsFillHouseHeartFill} color='green' boxSize={6} /></>):(<><Icon as={BsFillHouseSlashFill} color='red' boxSize={6} /></>)} {restaurant.online_delivery ? 'Yes' : 'No'} </Text>
            <Text ml="15px">
              
            </Text>
          </NavLink>
          <Text ml="25px" mt="10px" color="#0244A1">
            <Link href={restaurant.store_link} isExternal display="flex" alignItems="center" align="center">
              <Icon as={FaStaylinked} color='#78C257' boxSize={6} />
              <Text ml={2}>Restaurant Website</Text>
            </Link>
          </Text>
          <Text ml="25px" mt="10px" color="#0244A1">
            <Link href={restaurant.fb_link} isExternal display="flex" alignItems="center" align="center">
              <Icon as={BsFacebook} color='#4267B2' boxSize={6} />
              <Text ml={2}>Facebook</Text>
            </Link>
          </Text>
          <Text ml="25px" mt="10px" color="#0244A1">
            <Link href={restaurant.insta_link} isExternal display="flex" alignItems="center" align="center">
              <Icon as={FaInstagram} color='#E1306C' boxSize={6} />
              <Text ml={2}>Instagram</Text>
            </Link>
          </Text>
          <NavLink to={`/editRestaurants/${restaurant.restaurant_id}`}>
            <Flex justifyContent="flex-end">
              <Icon as={FaArrowRightLong} color='blackAlpha.900' boxSize={6} ml="auto" />
            </Flex>
          </NavLink>
        </Box>
        ))}
      </Flex>
    )}
    </Flex>
    </>
  );
}

export default RestaurantList;