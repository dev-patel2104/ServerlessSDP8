import React, { useEffect, useState } from 'react';
import { Flex, Text, Link, Icon, Box, Button } from '@chakra-ui/react';
import { theme } from '../../theme';
import { BsFacebook, BsFillHouseSlashFill, BsFillHouseHeartFill } from 'react-icons/bs';
import { FaInstagram, FaStaylinked, FaArrowRightLong } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
import { getAllRestaurants, deleteRestaurant } from '../../services/RestaurantServices/RestaurantService';
import { TbDiscount2 } from "react-icons/tb";

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [allOpenRestaurants, setAllOpenRestaurants] = useState([]);
  const [allClosedRestaurants, setAllClosedRestaurants] = useState([]);
  const [allRestaurantDiscounts, setAllRestaurantDiscounts] = useState([]);
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
      console.log('restaurants: ',restaurantResponse);
      var restaurantDiscounts = calculateDiscounts(restaurantResponse);
      setAllRestaurantDiscounts(restaurantDiscounts);
      console.log('restaurantDiscounts: ',restaurantDiscounts);
      setRestaurants(restaurantResponse);
      setAllOpenRestaurants(allOpenRestaurants);
      setAllClosedRestaurants(allClosedRestaurants);
      setLoading(false);
    }
    fetchData();
  }, []);

  function checkUserType(userType) {
    if (localStorage.getItem("userType") === userType)
      return true;
    else 
      return false;
  }

  async function deleteRestaurantRecord(restaurant_id) {
    const confirmDelete = window.confirm('Are you sure you want to delete this restaurant? (Once the data is lost it cannot be recovered.)');
    
    if (confirmDelete) {
      const restaurantResponse = await deleteRestaurant(restaurant_id);
      console.log("restaurant deletion: ", restaurantResponse);
      window.location.reload();
    }    
  }

  function calculateDiscounts(restaurants) {
    const discounts = {};
  
    restaurants.forEach(restaurant => {
      // restaurant
      if (restaurant.is_offer && restaurant.offer_on === 'restaurant') {
        discounts[restaurant.restaurant_id] = {
          discountType: 'restaurant',
          discountPercentage: restaurant.discount_percentage || 0
        };
      // menu item
      } else if (restaurant.is_offer && restaurant.offer_on === 'menu_item' && Array.isArray(restaurant.menu)) {
        let maxDiscount = 0;
        restaurant.menu.forEach(menuItem => {
          if (Array.isArray(menuItem.item_size_price)) {
            menuItem.item_size_price.forEach(sizePrice => {
              if (sizePrice.discount_percentage > maxDiscount) {
                maxDiscount = sizePrice.discount_percentage;
              }
            });
          }
        });
        discounts[restaurant.restaurant_id] = {
          discountType: 'menu_item',
          maxDiscountPercentage: maxDiscount
        };
      } else {
        discounts[restaurant.restaurant_id] = {
          discountType: 'no_discount',
          discount: 0
        };
      }
    });
  
    return discounts;
  }

  if (loading) {
    return <div>Please give us a few minutes fetching the Restaurants...</div>;
  }

  if (restaurants.length === 0) {
    return <div>Oops, Couldn't find any Restaurants. Sorry its on us. Please try again in some time.</div>;
  }

  return (
    <>
    <Flex w="100%" minHeight="10vh" p="10px" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="start">
      {checkUserType("partner") ? ( 
        <Text fontSize="4xl" fontWeight="bold">My Restaurants:</Text>
      ) : ( 
        <Text fontSize="4xl" fontWeight="bold">List of all Restaurant with us:</Text>
      )} 
    </Flex>
    <Flex w="100%" minHeight="5vh" backgroundColor={theme.primaryBackground}   justifyContent="space-around">
    
    { !checkUserType("partner") ? ( 

      <Flex flexDirection="column" alignItems="center" >
        {allOpenRestaurants.length === 0 ? (
          <Text fontSize="xl" textAlign="center" color="white" mt="20px">
            No open restaurants at the moment! Explore closed restaurants below.
          </Text>
        ) : ( allOpenRestaurants.map((restaurant) => (
          <Box key={restaurant.restaurant_id} boxShadow='xl' w="100%" mt="20px" bg="#FCFAFA" p="20px" rounded="md">
            <NavLink to={`/restaurants/${restaurant.restaurant_id}`}>
              <Text fontSize="2xl" fontWeight="bold">{restaurant.name}</Text>
              <Text fontSize="lg" color="#8A8896">{restaurant.address}</Text>
              {restaurant.is_new && (
                <Box bg="blue.500" color="white" p="10px" rounded="md" mt="20px">
                  <Text fontWeight="bold">New in Town!</Text>
                </Box>
              )}

              <Text mt="8px" fontWeight="medium">Opens at: {restaurant.start_time}</Text>
              <Text fontWeight="medium">Closes at: {restaurant.end_time}</Text>
              <Text fontSize="lg" as="em">{restaurant.tagline}</Text>
              <Text fontSize="lg">Online Delivery: {restaurant.online_delivery ? ( <> <Icon as={BsFillHouseHeartFill} color='green' boxSize={6} /></>):(<><Icon as={BsFillHouseSlashFill} color='red' boxSize={6} /></>)} {restaurant.online_delivery ? 'Yes' : 'No'} </Text>
              
              {allRestaurantDiscounts[restaurant.restaurant_id] && (
                <>
                  {(allRestaurantDiscounts[restaurant.restaurant_id].discountType === 'restaurant' && allRestaurantDiscounts[restaurant.restaurant_id].maxDiscountPercentage !== 0 ) ? (<>
                      
                      <Text fontWeight="medium" p="5px"><Icon as={TbDiscount2} color="green.500" boxSize={8} />{allRestaurantDiscounts[restaurant.restaurant_id].discountPercentage}% Discount all Items.</Text>
                    </>
                  ) : (
                    (allRestaurantDiscounts[restaurant.restaurant_id].discountType === 'menu_item' && allRestaurantDiscounts[restaurant.restaurant_id].maxDiscountPercentage !== 0 ) && (<>
                      
                      <Text fontWeight="medium" p="5px"><Icon as={TbDiscount2} color="green.500" boxSize={8} />Up To {allRestaurantDiscounts[restaurant.restaurant_id].maxDiscountPercentage}% Discount.</Text>
                      </>
                    )
                  )}
                </>
              )}
              <Text ml="15px">
                
              </Text>
            </NavLink>
            {restaurant.store_link && (
              <Text ml="25px" mt="10px" color="#0244A1">
                <Link href={restaurant.store_link} isExternal display="flex" alignItems="center" align="center">
                  <Icon as={FaStaylinked} color='#78C257' boxSize={6} />
                  <Text ml={2}>Restaurant Website</Text>
                </Link>
              </Text>
            )}

            {restaurant.fb_link && (
              <Text ml="25px" mt="10px" color="#0244A1">
                <Link href={restaurant.fb_link} isExternal display="flex" alignItems="center" align="center">
                  <Icon as={BsFacebook} color='#4267B2' boxSize={6} />
                  <Text ml={2}>Facebook</Text>
                </Link>
              </Text>
            )}

            {restaurant.insta_link && (
              <Text ml="25px" mt="10px" color="#0244A1">
                <Link href={restaurant.insta_link} isExternal display="flex" alignItems="center" align="center">
                  <Icon as={FaInstagram} color='#E1306C' boxSize={6} />
                  <Text ml={2}>Instagram</Text>
                </Link>
              </Text>
            )}

            {!restaurant.store_link && !restaurant.fb_link && !restaurant.insta_link && (
              <Text ml="5px" mt="10px" color="gray.500">
                Click to learn more about this restaurant
              </Text>
            )}
            <NavLink to={`/restaurants/${restaurant.restaurant_id}`}>
              <Flex justifyContent="flex-end">
                <Icon as={FaArrowRightLong} color='blackAlpha.900' boxSize={6} ml="auto" />
              </Flex>
            </NavLink>
          </Box>
        )))}

        <Text fontSize="4xl" fontWeight="bold" mt="20px" mb="20px">Currently Closed:</Text>

        {allClosedRestaurants.map((restaurant) => (
          <Box key={restaurant.restaurant_id} boxShadow='xl' w="100%" mt="20px" bg="#F2D5F8" p="20px" rounded="md">
            <NavLink to={`/restaurants/${restaurant.restaurant_id}`}>
              <Text fontSize="2xl" fontWeight="bold">{restaurant.name}</Text>
              <Text fontSize="lg" color="#6B6977">{restaurant.address}</Text>
              {restaurant.is_new && (
                <Box display="inline-block" bg="blue.500" color="white" p="8px" rounded="md" mt="20px">
                  <Text fontWeight="bold" fontSize="sm">New in Town!</Text>
                </Box>
              )}
              <Text mt="8px" fontWeight="medium">Opens at: {restaurant.start_time}</Text>
              <Text fontWeight="medium">Closes at: {restaurant.end_time}</Text>
              <Text fontSize="lg" as="em">{restaurant.tagline}</Text>
              <Text fontSize="lg">Online Delivery: {restaurant.online_delivery ? ( <> <Icon as={BsFillHouseHeartFill} color='green' boxSize={6} /></>):(<><Icon as={BsFillHouseSlashFill} color='red' boxSize={6} /></>)} {restaurant.online_delivery ? 'Yes' : 'No'} </Text>
            </NavLink>
            {allRestaurantDiscounts[restaurant.restaurant_id] && (
                <>
                  {(allRestaurantDiscounts[restaurant.restaurant_id].discountType === 'restaurant' && allRestaurantDiscounts[restaurant.restaurant_id].discountPercentage !== 0) ? (<>
                      
                      <Text fontWeight="medium" p="5px"><Icon as={TbDiscount2} color="green.500" boxSize={8} />{allRestaurantDiscounts[restaurant.restaurant_id].discountPercentage}% Discount all Items.</Text>
                    </>
                  ) : (
                    (allRestaurantDiscounts[restaurant.restaurant_id].discountType === 'menu_item' && allRestaurantDiscounts[restaurant.restaurant_id].maxDiscountPercentage !== 0 ) && (<>
                      
                      <Text fontWeight="medium" p="5px"><Icon as={TbDiscount2} color="green.500" boxSize={8} />Up To {allRestaurantDiscounts[restaurant.restaurant_id].maxDiscountPercentage}% Discount.</Text>
                      </>
                    )
                  )}
                </>
              )}
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
      
      <Flex flexDirection="column" alignItems="end">
        {restaurants.filter((restaurant_detail, index) => restaurant_detail.email_id === localStorage.getItem('foodvaganzaUser')).map((restaurant) => (
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
          
          {checkUserType("partner") && (
              <Button colorScheme="red" mt="35px" onClick={() => deleteRestaurantRecord(restaurant.restaurant_id)}> Delete Restaurant </Button>
            )}
        </Box>
        ))}
      </Flex>
    )}
    </Flex>
    </>
  );
}

export default RestaurantList;