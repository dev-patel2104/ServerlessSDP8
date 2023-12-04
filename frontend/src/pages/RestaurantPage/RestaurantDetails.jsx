import React, { useEffect, useState } from 'react';
import { Flex, Text, Link, Icon, Box, VStack, HStack, Image, Button, Select, Textarea, FormControl, FormLabel, Badge  } from '@chakra-ui/react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { BsFacebook, BsArrowLeft, BsFillHouseSlashFill, BsFillBagCheckFill, BsFillBagXFill, BsFillHouseHeartFill, BsTelephoneFill, BsStar, BsStarFill  } from 'react-icons/bs';
import { FaInstagram, FaLink, FaMapMarkedAlt, FaClock  } from 'react-icons/fa';
import { TbDiscount2, TbDiscountCheckFilled } from "react-icons/tb";
import { getRestaurant, updateRestaurantDetails } from '../../services/RestaurantServices/RestaurantService';
import { theme } from '../../theme';

function RestaurantDetails() {
  const { restaurant_id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [maxDiscount, setMaxDiscount] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`restaurant_id = ${restaurant_id}`);
    const fetchData = async () => {
        const restaurantResponse = await getRestaurant(restaurant_id);
        setRestaurant(restaurantResponse);
        console.log(restaurantResponse);
        setLoading(false);
        setMaxDiscount(Math.max(...restaurantResponse.menu.flatMap((menuItem) => menuItem.item_size_price.map((sizePrice) => parseFloat(sizePrice.discount_percentage)) )));
    }
    fetchData();

  }, [restaurant_id]);

  function checkUserType(userType) {
    if (localStorage.getItem("userType") === userType)
      return true;
    else 
      return false;
  }
  
  // Offer calculation and handling helper functions
  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    return (originalPrice * (1.0-(discountPercentage/100.0))).toFixed(2);
  };

  async function updateRestaurantData(restaurant) {
    console.log(restaurant);
    const restaurantResponse = await updateRestaurantDetails(restaurant);
    console.log(restaurantResponse);
  };


  async function submitFeedback () {

    const newCustomerReview = {
        customer_id: localStorage.getItem("foodvaganzaUser"), 
        rating: reviewRating.toString(), 
        review: reviewFeedback,
    };
    restaurant.reviews = [ ...restaurant.reviews, newCustomerReview];

    let response = await updateRestaurantData(restaurant);
    console.log("submit Feedback -> "+response);
    setReviewRating(0);
    setReviewFeedback('');
    window.location.reload();
  }

  function displayNumberOfStars(rating) {
    const starsToDisplay = [];
    for (let i = 0; i < rating; i++) {
        starsToDisplay.push(<BsStarFill key={i} color="#FFD700" />);
    }
    return starsToDisplay;
  }

  if (loading) {
    return <div>Loading restaurant details...</div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found.</div>;
  }

  return (
    <Flex flexDirection="column" alignItems="start" justifyContent="center" backgroundColor={theme.primaryBackground}>
        {/* {Object.keys(restaurant).length < 5 && restaurant["email_id"] && restaurant["menu"] && restaurant["restaurant_id"] ? ( */}
            {/* <Text fontSize="3xl" fontWeight="bold" color="red" textAlign="center" mt="20px"> */}
            {/* OOPS! Restaurant under construction */}
          {/* </Text> */}
            {/* ) : ( */}
                {/* <> */}
        <Box bg={theme.primaryBackground}  w="100%"  rounded="md" mb="5px">
            <Image src={`https://foodvaganza.s3.amazonaws.com/${restaurant_id}/${restaurant.image_path}`}  w="100%" h="200px"  objectFit="cover" />
        </Box>
        
        <Flex flexDirection="column" alignItems="start" justifyContent="space-between">
        <Box bg={theme.primaryBackground}  w="100%" mr="45%" ml="45%" rounded="md" >
            <Flex alignItems="center">
                <Text fontSize="4xl" p="20px" fontWeight="bold">{restaurant.name}</Text>
                {restaurant.is_offer && restaurant.offer_on === 'restaurant' && (
                    <>
                        <Icon as={TbDiscount2} color="green.500" boxSize={10} />
                        <Text fontWeight="bold" fontSize="1xl">{`${restaurant.discount_percentage}% OFF (on All Menu Items)`}</Text>
                    </>
                )}
                {restaurant.is_offer && restaurant.offer_on === 'menu_item' && (
                    <>
                        <Icon as={TbDiscount2} color="green.500" boxSize={10} />
                        {`DISCOUNTS UPTO `}<Text fontWeight="bold" fontSize="1xl" ml="1" mr="1">{` $${maxDiscount}% OFF `}</Text> {`(on Selected Menu Items)`}
                    </>
                )}
            </Flex>
            <Flex direction="row">
                {!restaurant.is_open ? (
                <Box bg="red.500" color="white" p="10px" rounded="md" m="10px" ml="40px">
                    <Text fontWeight="bold">Currently Closed by Owner</Text>
                </Box>
                ) : (
                <Box bg="green.500" color="white" p="10px" rounded="md" m="10px" ml="40px">
                    <Text fontWeight="bold">Restaurant Open & Serving</Text>
                </Box>
                )}

                {restaurant.is_new && (
                <Box bg="blue.500" color="white" p="10px" rounded="md" m="10px" ml="40px">
                    <Text fontWeight="bold">New in Town!</Text>
                </Box>
                )}
            </Flex>
            <Box bg="white" p="20px" ml="40px" rounded="md">
                <Text p="5px" fontSize="lg" fontStyle="italic">{restaurant.tagline}</Text>
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
                {checkUserType("user") && (
                    <Button mt="15px" colorScheme='purple' onClick={() => navigate(`/restaurants/${restaurant_id}/book`)}>Reserve your Table</Button>
                )}

            </Box>
            <Text fontSize="4xl" p="20px" fontWeight="bold">Our Menu Items</Text>
            <VStack alignItems="start" spacing="20px" ml="60px">
            {Array.isArray(restaurant.menu) && restaurant.menu.length > 0 ? ( 
                restaurant.menu.map((menuItem) => (
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
                            <Text fontSize="lg" fontWeight="bold">{sizePrice.size}</Text>
                            {restaurant.is_offer && restaurant.offer_on === 'restaurant' ? (
                            <>
                                <Text as="s" color="gray.500">{`$${sizePrice.price.toFixed(2)}${sizePrice.type ? ` per ${sizePrice.type}` : ''}`}</Text>
                                <Text fontWeight="bold" ml="2">
                                    <Icon as={TbDiscountCheckFilled} color="green.500" boxSize={5} mr="5px"/>
                                    {`$${calculateDiscountedPrice(sizePrice.price, restaurant.discount_percentage)}${sizePrice.type ? ` per ${sizePrice.type}` : ''}`}
                                </Text>
                            </>
                            ) : (
                            <>
                                {sizePrice.offer_type === 'percentage' ? (
                                <>
                                    <Text as="s" color="gray.500">{`$${sizePrice.price.toFixed(2)}${sizePrice.type ? ` per ${sizePrice.type}` : ''}`}</Text>
                                    <Text fontWeight="bold" ml="2">
                                        <Icon as={TbDiscountCheckFilled} color="green.500" boxSize={5} mr="5px"/>
                                        {`$${calculateDiscountedPrice(sizePrice.price, sizePrice.discount_percentage)}${sizePrice.type ? ` per ${sizePrice.type}` : ''}`}
                                    </Text>
                                </>
                                ) : (
                                <Text>{`$${sizePrice.price.toFixed(2)}${sizePrice.type ? ` per ${sizePrice.type}` : ''}`}</Text>
                                )}
                            </>
                            )}
                        </Box>
                        ))}
                    </HStack>
                    </Box>
                ))
                ) : (
                    <Text as="span" fontWeight="bold" color="purple.500">No menu items present in Menu.</Text>
                  )}
            </VStack>
            
            <Text fontSize="4xl" p="20px" fontWeight="bold">Hear from Our Customers:</Text>
            <VStack alignItems="start" spacing="20px" ml="60px">
                {/* Display reviews */}
                {restaurant.reviews.map((review, index) => (
                    <Box key={index} mt="4px" p="4px" bg="gray.50" rounded="md" boxShadow="md">
                        <Flex align="center">
                            <Badge variant="solid" colorScheme="purple" fontSize="sm" mr="2px"> Rating: {review.rating} </Badge>
                            <Flex> {displayNumberOfStars(parseInt(review.rating)).map((star, index) => (
                                        <Box key={index} mr="1px"> {star} </Box>
                                    ))}
                            </Flex>
                        </Flex>
                        <Text fontSize="md" color="gray.700" maxW="400px" overflow="hidden" textOverflow="ellipsis" textAlign="justify"> {review.review} </Text>
                    </Box>
                ))}

                {/* Get feedback input: */}
                <Box bg="white" p="20px" rounded="md" w="100%" border="1px solid #ccc">
                    <Text fontSize="xl" fontWeight="bold" mb="20px" >Share Your Experience</Text>
                    <FormControl mb="4px">
                        <FormLabel>How would you rate us?</FormLabel>
                        <Select value={reviewRating} isDisabled={localStorage.getItem("userType") == "user" ? false : true} onChange={(event) => setReviewRating(event.target.value)}>
                        {[0, 1, 2, 3, 4, 5].map((value) => (
                            <option key={value} value={value}>
                            {value}
                            </option>
                        ))}
                        </Select>
                    </FormControl>
                    <Text mt="20px" mb="20px" >Let us know what you think:</Text>
                    <Textarea placeholder="Please enter your feedback here..." value={reviewFeedback} isDisabled={localStorage.getItem("userType") == "user" ? false : true} onChange={(event) => setReviewFeedback(event.target.value)} size="md" resize="vertical" mb="4px" />
                    <Button colorScheme="purple" isDisabled={localStorage.getItem("userType") == "user" ? false : true} onClick={submitFeedback}> Submit </Button>
                </Box>
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
    {/* </> */}
    {/* )} */}
    </Flex>
  );
}

export default RestaurantDetails;
