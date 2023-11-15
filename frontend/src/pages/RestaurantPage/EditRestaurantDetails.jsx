import React, { useState, useEffect } from 'react';
import { Flex, Text, Icon, Box, VStack, HStack, Image, Button, Input, Textarea, useToast, Select } from '@chakra-ui/react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { getRestaurant, updateRestaurantDetails } from '../../services/RestaurantServices/RestaurantService';
// import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react';

function restaurant() {
  const { restaurant_id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [inEditingMode, setInEditingMode] = useState(false); 
  const [inEditMenu, setInEditMenu] = useState(false);
  const toast = useToast();

  const menuDetailTemplate = {
    item_name: '',
    item_description: '',
    category: '',
    item_type: '',
    is_available: true,
    item_qty: 0,
    item_size_price: [
      { size: '', price: 0, type: '' },
    ],
  }
  const [newMenuItemDetail, setNewMenuItemDetail] = useState(menuDetailTemplate);

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

  async function updateRestaurantData(restaurant) {
    console.log(restaurant);
    const restaurantResponse = await updateRestaurantDetails(restaurant);
    console.log(restaurantResponse);
  }

  // Menu item helper functions:

  async function updateMenuDetailChanges(itemId, field, value) {
    const updatedMenu = restaurant.menu.map((item) => item.item_id === itemId ? { ...item, [field]: value } : item);
    console.log(updatedMenu);
    setRestaurant({ ...restaurant, menu: updatedMenu });
    const restaurantResponse = await updateRestaurantDetails(restaurant);
    console.log(restaurantResponse);
    console.log(restaurant);
  };

  async function updateSizePrice (menuItem, index, field, value) {
    const updatedSizePrice = [...menuItem.item_size_price];
    updatedSizePrice[index] = { ...updatedSizePrice[index], [field]: value };
    await updateMenuDetailChanges(menuItem.item_id, 'item_size_price', updatedSizePrice);
    console.log('update size price() , menuItem => ',menuItem);
  };

  const addNewMenuItem = () => {
    // TODO: Replace with UUID
    const newMenuItem = { ...newMenuItemDetail, item_id: Date.now() };
    
    setNewMenuItemDetail(newMenuItem);
    // enable edit mode
    setInEditMenu(true);
  
    // Append the new menu item to the restaurant's menu item list
    setRestaurant((prevRestaurant) => ({ ...prevRestaurant, menu: [...prevRestaurant.menu, newMenuItem] }));
  };

  const enableMenuEditMode  = () => {
    setInEditMenu(true);
  };

  async function saveMenuEditChanges () {
    setInEditMenu(false);
    console.log(restaurant.menu);
    await updateRestaurantData(restaurant);
    window.location.reload();
  };

  // Image upload helper functions:

  const sendToLambda = async (base64Data, menuItem) => {
      const lambdaEndpoint = 'https://hc4eabn0s8.execute-api.us-east-1.amazonaws.com/upload-image'; 
      const payload = JSON.stringify({
        base64_data : base64Data,
        menu_item_id: menuItem.item_id,
        restaurant_id: restaurant_id
      })
      console.log("menuItem.item_id -> ",menuItem.item_id);

      const response = await fetch(lambdaEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: payload,
      });
  
      if (!response.ok) {
        throw new Error('Failed to send data to Lambda');
      }
      
      const lambdaResponse = await response.json();
      console.log('Lambda response:', lambdaResponse);
  
      updateMenuDetailChanges(menuItem.item_id, 'item_image_path', lambdaResponse['key']);

      toast({
        title: "Image uploaded successfully!",
        status: "success",
        duration: 5000, 
        isClosable: true,
      });
  };

  const initiateImageUpload = async (event, menuItem) => {
    const file = event.target.files[0];
  
    if (file) {
      // Read the file as base64
      const reader = new FileReader();
  
      reader.onload = async (e) => {
        const base64Data = e.target.result.split(',')[1];
        await sendToLambda(base64Data, menuItem);
      };
  
      reader.readAsDataURL(file);
    }
  };

  // handle delete menu item
  async function deleteMenuItem(itemId) {
    const isConfirmed = window.confirm('Are you sure you want to delete this item?');
    if (isConfirmed) {
      const updatedMenu = restaurant.menu.filter(item => item.item_id !== itemId);
      await updateRestaurantData({ ...restaurant, menu: updatedMenu });
      window.location.reload();
    }
  };

  // Offer calculation and handling helper functions
  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    return (originalPrice * (1.0-(discountPercentage/100.0))).toFixed(2);
  };
  

  if (loading) {
    return <div>Loading restaurant details...</div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found.</div>;
  }

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
            {inEditingMode ? (
              <>
                <span style={{ fontSize:'1xl', display: 'inline-block', width: '190px' }}>Restaurant Name:</span>
                <Input name="name" value={restaurant.name} onChange={(event) => setRestaurant({ ...restaurant, name: event.target.value })} />
              </>
            ) : (
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="4xl" p="20px" fontWeight="bold">{restaurant.name}</Text>
                <Button mt="15px" colorScheme='yellow' onClick={() => navigate(`/restaurants/${restaurant_id}`)}> View as Customer </Button>
              </Flex>
            )}

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
                      var edittedTime = event.target.value;
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
                    var edittedTime = event.target.value;
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
              {/* <Text p="5px" fontSize="lg">
                <span style={{ display: 'inline-block', width: '190px' }}>Online Delivery:</span>
                {inEditingMode ? (
                  <Select name="online_delivery" value={restaurant.online_delivery} onChange={(event) => setRestaurant({ ...restaurant, online_delivery: event.target.value === 'Yes' })} >
                    <option value="Yes">Available</option>
                    <option value="No">Not Offered</option>
                  </Select>
                ) : (
                  restaurant.online_delivery
                )}
              </Text> */}

              <Text p="5px" fontSize="lg">
                <span style={{ display: 'inline-block', width: '190px' }}>Online Delivery:</span>
                {inEditingMode ? (
                  <input
                    type="checkbox"
                    name="online_delivery"
                    checked={restaurant.online_delivery}
                    onChange={(event) => setRestaurant({ ...restaurant, online_delivery: event.target.checked })}
                  />
                ) : (
                  restaurant.online_delivery ? 'Yes' : 'No'
                )}
              </Text>


              {/* max_booking_capacity  */}
              {/* <Text p="5px" fontSize="lg">
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
              </Text> */}
              <Text p="5px" fontSize="lg">
                <span style={{ display: 'inline-block', width: '190px' }}>Max Booking Capacity:</span>
                {inEditingMode ? (
                  <Input type="number" name="max_booking_capacity" value={restaurant.max_booking_capacity} onChange={(event) => setRestaurant({ ...restaurant, max_booking_capacity: event.target.value })} />
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
              {/* insta_link  */}
              <Text p="5px" fontSize="lg">
                <span style={{ display: 'inline-block', width: '190px' }}>Instagram Link:</span>
                {inEditingMode ? (
                  <Input name="insta_link" value={restaurant.insta_link} onChange={(event) => setRestaurant({ ...restaurant, insta_link: event.target.value })} />
                ) : (
                  restaurant.insta_link
                )}
              </Text>
              {/* is Restaurant Open / Operational  */}
              <Text p="5px" fontSize="lg">
                <span style={{ display: 'inline-block', width: '190px' }}>Declaration Restaurant is Open:</span>
                {inEditingMode ? (
                  <input type="checkbox" name="is_open" checked={restaurant.is_open} onChange={(event) => setRestaurant({ ...restaurant, is_open: event.target.checked })} />
                ) : (
                  restaurant.is_open ? 'Yes-Open' : 'No-Closed'
                )}
              </Text>
              {/* Offers section */}
              <Box p="20px" bg="white" rounded="md" boxShadow="md" border="1px solid #ccc">
                <Text fontSize="xl" fontWeight="bold" mb="10px"> Discounts & Offers Section </Text>

                {/* Enable Offers */}
                <Text p="5px" fontSize="lg">
                  <span style={{ display: 'inline-block', width: '190px' }}>Enable Offers:</span>
                  {inEditingMode ? (
                    <input type="checkbox" name="is_offer" checked={restaurant.is_offer} onChange={(event) => setRestaurant({ ...restaurant, is_offer: event.target.checked })} />
                  ) : (
                    restaurant.is_offer ? 'Enabled - Offers will be applied to Menu Items' : 'Disabled - No Offers set'
                )}
                </Text>
                {/* Discount Percentage */}
                <Text p="5px" fontSize="lg">
                  <span style={{ display: 'inline-block', width: '190px' }}>Discount Percentage:</span>
                  {inEditingMode ? (
                    <Input type="number" name="discount_percentage" value={restaurant.discount_percentage} onChange={(event) => setRestaurant({ ...restaurant, discount_percentage: event.target.value })} />
                  ) : (
                    `${restaurant.discount_percentage ?? 0} %`
                  )}
                </Text>
                {/* offer_on */}
                <Flex>
                  <Text p="5px" fontSize="lg" display='inline' width='190px'>Offer Applied On:</Text>
                  {inEditingMode ? (
                    <Select name="offer_on" value={restaurant.offer_on} onChange={(event) => setRestaurant({ ...restaurant, offer_on: event.target.value })}>
                      <option value={null || ""}>None</option>
                      <option value="menu_type">Menu Item specific</option>
                      <option value="restaurant">All restaurant items</option>
                    </Select>
                  ) : (
                    <>
                      <Text p="5px" fontSize="lg">
                        {restaurant.offer_on ==='restaurant' ? ("All restaurant items") : restaurant.offer_on === 'menu_item' ? ("Menu Item specific"): ("N/A - Offer Not Applied")}
                      </Text>
                    </>
                  )}
                </Flex>

              </Box>
            
            <Button mt="15px" colorScheme={inEditingMode ? "green" : "purple"} onClick={inEditingMode ? saveEditChanges : enableEditMode}>
              {inEditingMode ? 'Save Changes' : 'Edit Restaurant Details'}
            </Button>
          </Box>

          <Text fontSize="4xl" p="20px" fontWeight="bold"> Menu Items </Text>

          <Box p="20px" ml="40px" rounded="md" w="100%" >
            <Button colorScheme={inEditMenu ? "green" : "purple"} mr="20px"  onClick={inEditMenu ? saveMenuEditChanges : enableMenuEditMode}>{inEditMenu ? 'Save Changes' : 'Edit Menu Details'}</Button>
            <Button colorScheme="purple" onClick={addNewMenuItem}>Add New Menu Item</Button>
          </Box>

        <VStack alignItems="start" spacing="20px" ml="60px">
          {restaurant.menu.map((menuItem) => (
            
            <Box key={menuItem.item_id} bg="white" p="20px" rounded="md" w="100%" border="1px solid #ccc">
              {/* Menu Item Image */}
              <Image mb="15px" src={menuItem.item_image_path !== undefined ? `https://foodvaganza.s3.amazonaws.com/${restaurant_id}/${menuItem.item_image_path}` : `https://foodvaganza.s3.amazonaws.com/default_image.jpg`} alt={menuItem.item_name} w="100%" h="200px" objectFit="cover" />
              
              {inEditMenu ? ( 
                <>
                  <Text fontSize="md" fontWeight="medium" mt="5px">Update item Image:</Text>
                  <input type="file" onChange={(event) => initiateImageUpload(event,menuItem)} />
                </>
              ) : ( "" )}              


              {/* name */}
              {inEditMenu ? ( 
                <>
                  <Text fontSize="md" fontWeight="medium" mt="5px">Item Name:</Text>
                  <Input name="item_name" value={menuItem.item_name || " "} onChange={(e) => updateMenuDetailChanges(menuItem.item_id, 'item_name', e.target.value)} />
                </>
              ) : (
                <Text fontSize="lg" p="5px" fontWeight="bold">
                  {menuItem.item_name} 
                </Text>
              )}

              {/* Description */}
              {inEditMenu ? (
                <>
                  <Text fontWeight="medium" mt="5px" >Item Description:</Text>
                  <Input name="item_description" value={menuItem.item_description || " "} onChange={(e) => updateMenuDetailChanges(menuItem.item_id, 'item_description', e.target.value)} />                    
                </>
              ) : (
                <Text fontSize="md" p="5px" mt="5px"> {menuItem.item_description} </Text> 
              )}
              
              {/* Category */}
              <Text p="5px" fontSize="md">
                <span style={{ fontWeight:'var(--chakra-fontWeights-medium)', display: 'inline-block', width: '150px' }}>Category:</span>
                {inEditMenu ? (
                  <Input name="category" value={menuItem.category || " "} onChange={(event) => updateMenuDetailChanges(menuItem.item_id, 'category', event.target.value)} />
                  ) : (
                    menuItem.category
                )}
              </Text>

              {/* Type */}
              <Text p="5px" fontSize="md">
                <span style={{ fontWeight:'var(--chakra-fontWeights-medium)', display: 'inline-block', width: '150px' }}>Type:</span>
                {inEditMenu ? (
                  <Input name="item_type" value={menuItem.item_type || " "} onChange={(event) => updateMenuDetailChanges(menuItem.item_id, 'item_type', event.target.value)} />
                  ) : (
                    menuItem.item_type
                )}
              </Text>

              {/* Availability */}
              <Text p="5px" fontSize="md">
                <span style={{ fontWeight:'var(--chakra-fontWeights-medium)', display: 'inline-block', width: '150px' }}>Item Availability:</span>
                {inEditMenu ? (
                  <input style={{ marginLeft: '10px' }} type="checkbox" name="is_available" checked={menuItem.is_available} onChange={(event) => updateMenuDetailChanges(menuItem.item_id, 'is_available', event.target.checked)} />
                ) : (
                  <>
                    {menuItem.is_available ? (
                      <span style={{ fontSize: 'lg', color: 'green' }}>Available</span>
                    ) : (
                      <span style={{ fontSize: 'lg', color: 'red' }}>Not Available</span>
                    )}
                  </>
                )}
              </Text>
              
              {/* Quantity */}
              <Text p="5px" fontSize="md">
                <span style={{ fontWeight:'var(--chakra-fontWeights-medium)', display: 'inline-block', width: '150px' }}>Quantity:</span>
                {inEditMenu ? (
                  <input style={{ marginLeft: '10px', border:'1px solid #E2E8F0', borderRadius: '5px' }} type="number" name="item_qty" checked={menuItem.item_qty} onChange={(event) => updateMenuDetailChanges(menuItem.item_id, 'item_qty', event.target.value)} />
                ) : (
                  menuItem.item_qty
                )}
              </Text>
              
              <span style={{ padding: '5px', fontSize:'var(--chakra-fontSizes-lg)', display: 'inline', width: '150px' }}>Different Item sizes:</span>
              {inEditMenu ? (
                <VStack mt="10px" spacing="10px">
                  {menuItem.item_size_price.map((sizePrice, index) => (
                    <Box key={sizePrice.size} bg="gray.100" p="10px" rounded="md">
                      <Text fontWeight="md">Option #{index+1}</Text>
                      {/*  Size  */}
                      <Flex alignItems="center">
                        <Text fontSize="md" fontWeight="medium" width="80px">Size:</Text>
                        <Input value={sizePrice.size} placeholder="Size" onInput={(event) => { updateSizePrice(menuItem, index, 'size', event.target.value);}} />
                      </Flex>
                      
                      {/* Price */}
                      <Flex alignItems="center" mt="10px">
                        <Text fontSize="md" fontWeight="medium" width="80px">Price:</Text>
                        <Input value={sizePrice.price.toFixed(2) || ""} type="number" placeholder="Price" onInput={(event) => { updateSizePrice(menuItem, index, 'price', parseFloat(event.target.value) || 0); }} />
                      </Flex>
                      
                      {/* Type  */}
                      <Flex alignItems="center" mt="10px">
                        <Text fontSize="md" fontWeight="medium" width="80px">Type:</Text>
                        <Input value={sizePrice.type || ""} placeholder="Type" onInput={(event) => { updateSizePrice(menuItem, index, 'type', event.target.value); }} />
                      </Flex>
                    </Box>
                  ))}
                </VStack>
                ) : (
                  <HStack mt="10px" spacing="10px">
                    {menuItem.item_size_price.map((sizePrice) => (
                      <Box key={sizePrice.size} bg="gray.100" p="10px" rounded="md">
                        <Text fontSize="lg" fontWeight="bold">{sizePrice.size}</Text>
                        {restaurant.is_offer && restaurant.offer_on === 'restaurant' ? (
                          <>
                            <Text as="s" color="gray.500">{`$${sizePrice.price.toFixed(2)}${sizePrice.type ? ` per ${sizePrice.type}` : ''}`}</Text>
                            <Text fontWeight="bold" ml="2">{`$${calculateDiscountedPrice(sizePrice.price, restaurant.discount_percentage)}${sizePrice.type ? ` per ${sizePrice.type}` : ''}`}</Text>
                          </>
                        ) : (
                          <>
                            {sizePrice.offer_type === 'percentage' ? (
                              <>
                                <Text as="s" color="gray.500">{`$${sizePrice.price.toFixed(2)}${sizePrice.type ? ` per ${sizePrice.type}` : ''}`}</Text>
                                <Text fontWeight="bold" ml="2">{`$${calculateDiscountedPrice(sizePrice.price, sizePrice.discount_percentage)}${sizePrice.type ? ` per ${sizePrice.type}` : ''}`}</Text>
                              </>
                            ) : (
                              <Text>{`$${sizePrice.price.toFixed(2)}${sizePrice.type ? ` per ${sizePrice.type}` : ''}`}</Text>
                            )}
                          </>
                        )}
                      </Box>
                    ))}
                  </HStack>

                )}
              {inEditMenu ? ( "" ):(
                <Button colorScheme="red" mt="35px" onClick={() => deleteMenuItem(menuItem.item_id)}> Delete Item </Button>
              )}
            </Box>
          ))}
        </VStack>

        <Box p="20px" ml="40px" rounded="md" w="100%" >
          <Button colorScheme={inEditMenu ? "green" : "purple"} mr="20px"  onClick={inEditMenu ? saveMenuEditChanges : enableMenuEditMode}>{inEditMenu ? 'Save Changes' : 'Edit Menu Details'}</Button>
          <Button colorScheme="purple" onClick={addNewMenuItem}>Add New Menu Item</Button>
        </Box>

        <Box ml="15px" mt="20px">
          <NavLink to="/restaurants" p="20px">
            <Icon as={BsArrowLeft} color='blackAlpha.900' boxSize={6} /> Back to Restaurant List
          </NavLink>
        </Box>

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
