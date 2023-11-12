import React, { useState, useEffect } from 'react';
import { Flex, Text, Icon, Box, VStack, HStack, Image, Button, Input, Textarea, Select } from '@chakra-ui/react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { getRestaurant } from '../../services/RestaurantServices/RestaurantService';
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react';


function restaurant() {
  const { restaurant_id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [inEditingMode, setInEditingMode] = useState(false); 

  useEffect(() => {
    const fetchRestaurantData = async () => {
      const restaurantResponse = await getRestaurant(restaurant_id);
      setRestaurant(restaurantResponse);
      console.log(restaurantResponse);
      setLoading(false);
  }
  fetchRestaurantData();
  }, [restaurant_id]);

  const enableEditMode = () => {
    setInEditingMode(true);
  };

  const saveEditChanges = () => {
    updateRestaurantData(restaurant);
    setInEditingMode(false);
  };

  // const updateRestaurantData(restaurant);

  if (loading) {
    return <div>Loading restaurant details...</div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found.</div>;
  }


//   return (
//     <Flex align="center" justify="start" direction='column' fontSize='2rem' h="90vh">
//       <Flex alignItems="end" justifyContent="center" h="20vh" bgColor='black' width='100%' >
//         <Flex h="18vh" bgColor='white' width='60%' alignItems='center' justifyContent='center'>
//           <Flex h='10vh' bgColor='#ECC94B' width='40%' justifyContent='center' alignItems='center'>
//             <Text fontSize='2xl' fontWeight='extrabold'>EDIT RESTAURANT DETAILS</Text>
//           </Flex>
//         </Flex>
//       </Flex>
//       <Flex direction='column' mt='20px'>
//         <Text fontSize='md' fontWeight='bold'>Please enter the below details to update the restaurant information</Text>
//         <form onSubmit={saveEditChanges}>
//           <Flex align="center" justify="start" mt='40px' direction='row' fontSize='2rem'>
//             <FormControl isRequired>
//               <FormLabel>Restaurant Name</FormLabel>
//               <Input value={restaurant.name} onChange={(event) => setRestaurant({ ...restaurant, name: event.target.value })} type="text" placeholder="Enter restaurant name" />
//             </FormControl>
//             <FormControl isRequired>
//               <FormLabel>Tagline</FormLabel>
//               <Textarea value={restaurant.tagline} onChange={(event) => setRestaurant({ ...restaurant, tagline: event.target.value })} placeholder="Enter tagline" />
//             </FormControl>
//             <FormControl isRequired>
//               <FormLabel>Address</FormLabel>
//               <Input value={restaurant.address} onChange={(event) => setRestaurant({ ...restaurant, address: event.target.value })} type="text" placeholder="Enter address" />
//             </FormControl>
//             <FormControl isRequired>
//               <FormLabel>Contact Number</FormLabel>
//               <Input value={restaurant.contact} onChange={(event) => setRestaurant({ ...restaurant, contact: event.target.value })} type="tel" placeholder="Enter contact number" />
//             </FormControl>
//             <FormControl isRequired>
//               <FormLabel>Start Time</FormLabel>
//               <Input value={restaurant.start_time} onChange={(event) => setRestaurant({ ...restaurant, start_time: event.target.value })} type="text" placeholder="Enter start time" />
//             </FormControl>
//             <FormControl isRequired>
//               <FormLabel>End Time</FormLabel>
//               <Input value={restaurant.end_time} onChange={(event) => setRestaurant({ ...restaurant, end_time: event.target.value })} type="text" placeholder="Enter end time" />
//             </FormControl>
//             <FormControl>
//               <FormLabel>Store Link</FormLabel>
//               <Input value={restaurant.store_link} onChange={(event) => setRestaurant({ ...restaurant, store_link: event.target.value })} type="text" placeholder="Enter store link" />
//             </FormControl>
//             {/* Add more form controls for other fields as needed */}
//             <Button mt='40px' type="submit">Update Restaurant Details</Button>
//           </Flex>
//         </form>
//       </Flex>
//     </Flex>
//   );
// }

   return (
    <Flex flexDirection="column" alignItems="start" justifyContent="center">
      <Box bg="white" w="100%" rounded="md" mb="5px">
        <Image src={`https://foodvaganza.s3.amazonaws.com/${restaurant_id}/${restaurant.image_path}`} w="100%" h="200px" objectFit="cover" />
      </Box>
      <Flex flexDirection="column" alignItems="start" justifyContent="space-between">
        <Box bg="white" w="100%" mr="45%" ml="45%" rounded="md">
          <Text fontSize="4xl" p="20px" fontWeight="bold"></Text>

          {inEditingMode ? (<Text fontSize="4xl" p="20px" fontWeight="bold">Editing Restaurant details:</Text> ) : ( " " ) }

            {/* Restaurant Name */}
            <Text fontSize="4xl" p="20px" fontWeight="bold">
              {inEditingMode ? (
                <>
                  <span style={{ fontSize:'1xl', display: 'inline-block', width: '190px' }}>Restaurant Name:</span>
                  <Input name="name" value={restaurant.name} onChange={(event) => setRestaurant({ ...restaurant, name: event.target.value })} />
                </>
              ) : (
                restaurant.name
              )}
            </Text>
            <Box bg="white" p="20px" ml="40px" rounded="md">
              {/* Tag line */}
              <Text p="5px" fontSize="lg">
                <span style={{ display: 'inline-block', width: '190px' }}>Tagline:</span>
                {inEditingMode ? (
                  <Input name="tagline" value={restaurant.tagline} onChange={(event) => setRestaurant({ ...restaurant, tagline: event.target.value })} />
                ) : (
                  restaurant.tagline
                )}
              </Text>
              {/* Address */}
              <Text p="5px" fontSize="lg">
                <span style={{ display: 'inline-block', width: '190px' }}>Address:</span>
                {inEditingMode ? (
                  <Textarea name="address" value={restaurant.address} onChange={(event) => setRestaurant({ ...restaurant, address: event.target.value })} />
                ) : (
                  restaurant.address
                )}
              </Text>
              {/* Contact number */}
              <Text p="5px" fontSize="lg">
                <span style={{ display: 'inline-block', width: '190px' }}>Contact:</span>
                {inEditingMode ? (
                  <Input type="number" name="contact" value={restaurant.contact} onChange={(event) => setRestaurant({ ...restaurant, contact: event.target.value })} />
                ) : (
                  restaurant.contact
                )}
              </Text>
              {/* Opening time */}
              <Text p="5px" fontSize="lg">
                <span style={{ display: 'inline-block', width: '190px' }}>Opening Time:</span>
                {inEditingMode ? (
                  <Input type="time" name="start_time" value={restaurant.start_time} onChange={(event) => {
                      const edittedTime = event.target.value;
                      // removing the AM and PM at the end and getting "HH:MM"
                      edittedTime = edittedTime.substring(0, 5); 
                      setRestaurant({ ...restaurant, start_time: edittedTime })
                    }} 
                  />
                ) : (
                  restaurant.start_time
                )}
              </Text>
              {/* Closing time  */}
              <Text p="5px" fontSize="lg">
                <span style={{ display: 'inline-block', width: '190px' }}>Closing Time:</span>
                {inEditingMode ? (
                  <Input type="time" name="end_time" value={restaurant.end_time} onChange={(event) => {
                    const edittedTime = event.target.value;
                    // removing the AM and PM at the end and getting "HH:MM"
                    edittedTime = edittedTime.substring(0, 5); 
                    setRestaurant({ ...restaurant, end_time: edittedTime })
                  }} 
                />
                ) : (
                  restaurant.end_time
                )}
              </Text>
              {/* online_delivery */}
              <Text p="5px" fontSize="lg">
                <span style={{ display: 'inline-block', width: '190px' }}>Online Delivery:</span>
                {inEditingMode ? (
                  <Select name="online_delivery" value={restaurant.online_delivery} onChange={(event) => setRestaurant({ ...restaurant, online_delivery: event.target.value === 'Yes' })} >
                    <option value="Yes">Available</option>
                    <option value="No">Not Offered</option>
                  </Select>
                ) : (
                  restaurant.online_delivery
                )}
              </Text>
              {/* max_booking_capacity  */}
              <Text p="5px" fontSize="lg">
                <span style={{ display: 'inline-block', width: '190px' }}>Max Booking Capacity:</span>
                {inEditingMode ? (
                  <NumberInput type="number" min={5} max={100} name="max_booking_capacity" value={restaurant.max_booking_capacity} onChange={(valueString) => setRestaurant({ ...restaurant, max_booking_capacity: valueString != "NaN" ? parseInt(valueString) : "NA" })} >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                ) : (
                  restaurant.max_booking_capacity
                )}
              </Text>
              {/* store_link */}
              <Text p="5px" fontSize="lg">
                <span style={{ display: 'inline-block', width: '190px' }}>Store Link:</span>
                {inEditingMode ? (
                  <Input name="store_link" value={restaurant.store_link} onChange={(event) => setRestaurant({ ...restaurant, store_link: event.target.value })} />
                ) : (
                  restaurant.store_link
                )}
              </Text>
              {/* fb_link  */}
              <Text p="5px" fontSize="lg">
                <span style={{ display: 'inline-block', width: '190px' }}>Facebook Link:</span>
                {inEditingMode ? (
                  <Input name="fb_link" value={restaurant.fb_link} onChange={(event) => setRestaurant({ ...restaurant, fb_link: event.target.value })} />
                ) : (
                  restaurant.fb_link
                )}
              </Text>
            
            <Button mt="15px" colorScheme="purple" onClick={inEditingMode ? saveEditChanges : enableEditMode}>
              {inEditingMode ? 'Save Changes' : 'Edit Restaurant Details'}
            </Button>
          </Box>
          <Text fontSize="4xl" p="20px" fontWeight="bold">
            Our Menu Items
          </Text>
          <VStack alignItems="start" spacing="20px" ml="60px">
            {restaurant.menu.map((menuItem) => (
              <Box key={menuItem.item_id} bg="white" p="20px" rounded="md" w="100%" border="1px solid #ccc">
                <Image src={`https://foodvaganza.s3.amazonaws.com/${restaurant_id}/${menuItem.item_image_path}`} alt={menuItem.item_name} w="100%" h="200px" objectFit="cover" />
                <Text fontSize="lg" fontWeight="bold">
                  {inEditingMode ? (
                    <Input name="item_name" value={menuItem.item_name} onChange={(e) => setRestaurant({ ...restaurant, menu: updateItemsInMenu(restaurant.menu, menuItem.item_id, { ...menuItem, item_name: e.target.value }) })} />
                  ) : (
                    menuItem.item_name
                  )}
                </Text>
                <Text fontSize="md">{menuItem.item_description}</Text>
                <Text fontWeight="medium">Category: {menuItem.category}</Text>
                {menuItem.item_type && (
                  <Text fontWeight="medium">Type: {menuItem.item_type}</Text>
                )}
                {menuItem.is_available ? (
                  <>  <Text fontSize="lg" color="green.500"> Available </Text> </>
                ) : ( 
                  <> <Text fontSize="lg" color="red.500"> Not Available </Text> </>
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
        <Box mt="50px" h="150px"></Box>
      </Flex>
    </Flex>
  );
}

export default restaurant;

function updateItemsInMenu(menu, itemId, updatedItem) {
  return menu.map((item) => (item.item_id === itemId ? updatedItem : item));
}
