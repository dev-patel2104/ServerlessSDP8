import React, { useState, useEffect } from 'react';
import { Flex, Text, Icon, Box, VStack, HStack, Image, Button, Input, Textarea, useToast, Select, FormControl, FormLabel } from '@chakra-ui/react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import { getRestaurant, updateRestaurantDetails } from '../../services/RestaurantServices/RestaurantService';
import {  TbDiscountCheckFilled } from "react-icons/tb";
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

      setInEditingMode(checkAllMandatoryKeysExist(restaurantResponse));
  }
  fetchRestaurantData();
  }, [restaurant_id]);

  function checkAllMandatoryKeysExist(restaurant) {
    const mandatoryKeys = ['name','is_open','email_id','address','contact','start_time','end_time','online_delivery','max_booking_capacity'];

    if (restaurant && typeof restaurant === 'object') {
        const allKeysPresent = mandatoryKeys.every(key => restaurant.hasOwnProperty(key));
        const allValuesNonNull = mandatoryKeys.every(key => restaurant[key] !== null && restaurant[key] !== undefined);

        const isIncomplete = !allKeysPresent || !allValuesNonNull;
        setInEditingMode(isIncomplete);
        return isIncomplete;
    }
    return false;
}

  const enableEditMode = () => {
    setInEditingMode(true);
  };

  async function saveEditChanges() {
    if (checkAllMandatoryKeysExist(restaurant)) {
      alert('Please fill in all mandatory fields.');
      return;
    }
    await updateRestaurantData(restaurant);
    setInEditingMode(false);
  };

  async function updateRestaurantData(restaurant) {
    console.log(restaurant);
    const restaurantResponse = await updateRestaurantDetails(restaurant);
    console.log(restaurantResponse);
    // window.location.reload();
  };

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
    console.log('newMenuItem : ',newMenuItem);
    setNewMenuItemDetail(newMenuItem);
    setInEditMenu(true);
  
    setRestaurant((prevRestaurant) => {
      const updatedMenuItemArray = Array.isArray(prevRestaurant.menu) ? [...prevRestaurant.menu, newMenuItem] : [newMenuItem];
      return { ...prevRestaurant, menu: updatedMenuItemArray };
    });

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

  const sendToLambda = async (base64Data, image_id, flag) => {
      const lambdaEndpoint = 'https://hc4eabn0s8.execute-api.us-east-1.amazonaws.com/upload-image'; 
      const payload = JSON.stringify({
        base64_data : base64Data,
        menu_item_id: image_id,
        restaurant_id: restaurant_id
      })
      console.log("menuItem.item_id -> ",image_id);

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
      
      if (flag === "menu_item_id"){
        updateMenuDetailChanges(image_id, 'item_image_path', lambdaResponse['key']);
      }
      else {
        setRestaurant(prevRestaurant => {
          const updatedRestaurant = { ...prevRestaurant, image_path: image_id + '.jpg' };
          console.log('updated restaurant:', updatedRestaurant);
          updateRestaurantData(updatedRestaurant);
          return updatedRestaurant;
        });
        console.log('updated restaurant : ',restaurant);
        await updateRestaurantData(restaurant);
        console.log("restaurant image-id added!")
      }

      toast({
        title: "Image uploaded successfully!",
        status: "success",
        duration: 5000, 
        isClosable: true,
      });
  };

  const initiateImageUpload = async (event, image_id, flag="menu_item_id") => {
    const file = event.target.files[0];
  
    if (file) {
      // Read the file as base64
      const reader = new FileReader();
  
      reader.onload = async (e) => {
        const base64Data = e.target.result.split(',')[1];
        await sendToLambda(base64Data, image_id,flag);
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
        <Image src={restaurant.image_path !== undefined ? `https://foodvaganza.s3.amazonaws.com/${restaurant_id}/${restaurant.image_path}` : `https://foodvaganza.s3.amazonaws.com/default_image.jpg`} w="100%" h="200px" objectFit="cover" />
      </Box>
      <Flex flexDirection="column" alignItems="start" justifyContent="space-between">
        <Box bg="white" w="100%" mr="20%" ml="20%" rounded="md">
          <Text fontSize="4xl" p="20px" fontWeight="bold"></Text>

          {inEditingMode ? (<Text fontSize="4xl" mb="20px" fontWeight="bold">Editing Restaurant details:</Text> ) : ( " " ) }

            <Box bg="white" p="20px"  rounded="md">
            {/* Restaurant Name */}
            {inEditingMode ? (
              <>
              <Flex alignItems="center" mt="8px">
                <FormControl isRequired display="flex" alignItems="center">
                  <FormLabel p="5px" fontSize="lg" minW="190px"><span>Restaurant Name:</span></FormLabel>
                  {inEditingMode ? (
                    <Input name="name" value={restaurant.name} placeholder="Enter restaurant name here" onChange={(event) => setRestaurant({ ...restaurant, name: event.target.value })} />
                  ) : (
                    restaurant.name
                  )}
                </FormControl>
              </Flex>
              </>
            ) : (
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="4xl" p="20px" fontWeight="bold">{restaurant.name}</Text>
                <Button mt="15px" colorScheme='yellow' onClick={() => navigate(`/restaurants/${restaurant_id}`)}> View as Customer </Button>
              </Flex>
            )}

            {/* Update Restaurant Image */}
            {inEditingMode ? (
              <Flex alignItems="center" mt="8px">
                <FormControl isRequired display="flex" alignItems="center">
                  <FormLabel p="5px" fontSize="lg" minW="190px"><span>Update Restaurant Image:</span></FormLabel>
                    <input type="file" onChange={(event) => initiateImageUpload(event, restaurant_id, "restaurant_id")} />
                </FormControl>
              </Flex>
            ) : ("" )} 
            {/* Declaration Restaurant is Open */}
            <Flex alignItems="center" mt="8px">
              <FormControl isRequired display="flex" alignItems="center">
                <FormLabel p="5px" fontSize="lg" minW="190px"><span>Declaration Restaurant is Open:</span></FormLabel>
                {inEditingMode ? (
                  <input type="checkbox" name="is_open" checked={restaurant.is_open} onChange={(event) => setRestaurant({ ...restaurant, is_open: event.target.checked })} />
                ) : (
                  <Text fontSize="lg" p="5px" ml="10px">{restaurant.is_open ? 'Yes-Open' : 'No-Closed'}</Text>
                )}
              </FormControl>
            </Flex>
            
            {/* Address */}
            <Flex alignItems="center" mt="8px">
              <FormControl isRequired display="flex" alignItems="center">
                <FormLabel p="5px" fontSize="lg" minW="190px"><span>Address:</span></FormLabel>
                {inEditingMode ? (
                  <Textarea name="address" value={restaurant.address} onChange={(event) => setRestaurant({ ...restaurant, address: event.target.value })} />
                ) : (
                  <Text fontSize="lg" p="5px" ml="10px">{restaurant.address}</Text>
                )}
              </FormControl>
            </Flex>

            {/* Contact number */}
            <Flex alignItems="center" mt="8px">
              <FormControl isRequired display="flex" alignItems="center">
                <FormLabel p="5px" fontSize="lg" minW="190px"><span>Contact:</span></FormLabel>
                {inEditingMode ? (
                  <Input type="number" name="contact" value={restaurant.contact} onChange={(event) => setRestaurant({ ...restaurant, contact: event.target.value })} />
                ) : (
                  <Text fontSize="lg" p="5px" ml="10px">{restaurant.contact}</Text>
                )}
              </FormControl>
            </Flex>

            {/* Opening time */}
            <Flex alignItems="center" mt="8px">
              <FormControl isRequired display="flex" alignItems="center">
                <FormLabel p="5px" fontSize="lg" minW="190px"><span>Opening Time:</span></FormLabel>
                {inEditingMode ? (
                  <Input type="time" name="start_time" value={restaurant.start_time} onChange={(event) => {
                    var editedTime = event.target.value;
                    editedTime = editedTime.substring(0, 5); // removing the AM and PM at the end and getting "HH:MM"
                    setRestaurant({ ...restaurant, start_time: editedTime })
                  }} />
                ) : (
                  <Text fontSize="lg" p="5px" ml="10px">{restaurant.start_time}</Text>
                )}
              </FormControl>
            </Flex>
            {/* Closing time */}
            <Flex alignItems="center" mt="8px">
              <FormControl isRequired display="flex" alignItems="center">
                <FormLabel p="5px" fontSize="lg" minW="190px"><span>Closing Time:</span></FormLabel>
                {inEditingMode ? (
                  <Input type="time" name="end_time" value={restaurant.end_time} onChange={(event) => {
                    var editedTime = event.target.value;
                    editedTime = editedTime.substring(0, 5); // removing the AM and PM at the end and getting "HH:MM"
                    setRestaurant({ ...restaurant, end_time: editedTime })
                  }} />
                ) : (
                  <Text fontSize="lg" p="5px" ml="10px">{restaurant.end_time}</Text>
                )}
              </FormControl>
            </Flex>
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
            <Flex alignItems="center" mt="8px">
              <FormControl isRequired display="flex" alignItems="center">
                <FormLabel p="5px" fontSize="lg" minW="190px"><span>Online Delivery:</span></FormLabel>
                {inEditingMode ? (
                  <input
                    type="checkbox"
                    name="online_delivery"
                    checked={restaurant.online_delivery}
                    onChange={(event) => setRestaurant({ ...restaurant, online_delivery: event.target.checked })}
                  />
                ) : (
                  <Text fontSize="lg" p="5px" ml="10px">{restaurant.online_delivery ? 'Yes' : 'No'}</Text>
                )}
              </FormControl>
            </Flex>


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
            <Flex alignItems="center" mt="8px">
              <FormControl isRequired display="flex" alignItems="center">
                <FormLabel p="5px" fontSize="lg" minW="190px"><span>Max Booking Capacity:</span></FormLabel>
                {inEditingMode ? (
                  <Input type="number" name="max_booking_capacity" value={restaurant.max_booking_capacity} onChange={(event) => setRestaurant({ ...restaurant, max_booking_capacity: event.target.value })} />
                ) : (
                  <Text fontSize="lg" p="5px" ml="10px">{restaurant.max_booking_capacity}</Text>
                )}
              </FormControl>
            </Flex>
            {/* Tag line */}
            <Flex alignItems="center" mt="8px">
              <FormControl display="flex" alignItems="center">
                <FormLabel p="5px" fontSize="lg" minW="190px"><span>Tagline:</span></FormLabel>
                {inEditingMode ? (
                  <Input name="tagline" value={restaurant.tagline} onChange={(event) => setRestaurant({ ...restaurant, tagline: event.target.value })} />
                ) : (
                  restaurant.tagline
                )}
              </FormControl>
            </Flex>

            {/* Store Link */}
            <Flex alignItems="center" mt="8px">
              <FormControl display="flex" alignItems="center">
                <FormLabel p="5px" fontSize="lg" minW="190px"><span>Store Link:</span></FormLabel>
                {inEditingMode ? (
                  <Input name="store_link" value={restaurant.store_link} onChange={(event) => setRestaurant({ ...restaurant, store_link: event.target.value })} />
                ) : (
                  <Text fontSize="lg" p="5px" ml="10px">{restaurant.store_link}</Text>
                )}
              </FormControl>
            </Flex>

            {/* Facebook Link */}
            <Flex alignItems="center" mt="8px">
              <FormControl display="flex" alignItems="center">
                <FormLabel p="5px" fontSize="lg" minW="190px"><span>Facebook Link:</span></FormLabel>
                {inEditingMode ? (
                  <Input name="fb_link" value={restaurant.fb_link} onChange={(event) => setRestaurant({ ...restaurant, fb_link: event.target.value })} />
                ) : (
                  <Text fontSize="lg" p="5px" ml="10px">{restaurant.fb_link}</Text>
                )}
              </FormControl>
            </Flex>

            {/* Instagram Link */}
            <Flex alignItems="center" mt="8px">
              <FormControl display="flex" alignItems="center">
                <FormLabel p="5px" fontSize="lg" minW="190px"><span>Instagram Link:</span></FormLabel>
                {inEditingMode ? (
                  <Input name="insta_link" value={restaurant.insta_link} onChange={(event) => setRestaurant({ ...restaurant, insta_link: event.target.value })} />
                ) : (
                  <Text fontSize="lg" p="5px" ml="10px">{restaurant.insta_link}</Text>
                )}
              </FormControl>
            </Flex>

              {/* Offers section */}
              <Box p="20px" bg="white" rounded="md" boxShadow="md" mt="20px" border="1px solid #ccc">
                <Text fontSize="xl" fontWeight="bold" mb="10px"> Discounts & Offers Section </Text>

                {/* Enable Offers */}
                <Text p="5px" fontSize="lg">
                  <span style={{ display: 'inline-block', width: '190px' }}>Enable Offers:</span>
                  {inEditingMode ? (
                    <input type="checkbox" name="is_offer" checked={restaurant.is_offer} onChange={(event) => 
                      setRestaurant({ ...restaurant, 
                        is_offer: event.target.checked, // Set the boolean is_offer flag
                        // if is_offer is false then reset to default values
                        discount_percentage: event.target.checked ? restaurant.discount_percentage : 0, 
                        offer_on: event.target.checked ? restaurant.offer_on : null,
                        // reset menu offer attributes as well
                        menu: restaurant.menu.map((menuItem) => ({
                          ...menuItem, item_size_price: menuItem.item_size_price.map((sizePrice) => ({ ...sizePrice, 
                                                                                    discount_percentage: event.target.checked ? sizePrice.discount_percentage : 0, 
                                                                                    offer_type: event.target.checked ? sizePrice.offer_type : null,
                                                                })),
                                                  })),
                      })} />
                  ) : (
                    restaurant.is_offer ? 'Enabled - Offers will be applied to Menu Items' : 'Disabled - No Offers set'
                )}
                </Text>
                
                {/* offer_on */}
                <Flex>
                <Text p="5px" fontSize="lg" display='inline' width='190px'>Offer Applied On:</Text>
                  {inEditingMode && restaurant.is_offer ? (
                    <Select name="offer_on" value={restaurant.offer_on || ""} onChange={(event) => {
                      if (event.target.value === 'restaurant') {
                        // if discount applied restaurant wide then reset menu_item specifc attributes 
                        const updatedMenuItems = restaurant.menu.map(item => ({ ...item, offer_on: null, discount_percentage: 0 }));

                        setRestaurant({ ...restaurant, offer_on: event.target.value, menu: updatedMenuItems });
                      } else {
                        setRestaurant({ ...restaurant, offer_on: event.target.value, discount_percentage: 0 });
                      }   
                    }}>
                      <option value="menu_item">Menu Item specific</option>
                      <option value="restaurant">All restaurant items</option>
                    </Select>
                  ) : (
                    <>
                      <Text p="5px" fontSize="lg">
                        {restaurant.offer_on === 'restaurant' ? ("All restaurant items") : (restaurant.offer_on === 'menu_item' ? ("Menu Item specific") : ("N/A - Offer Not Applied"))}
                      </Text>
                    </>
                  )}

                </Flex>
                {/* Discount Percentage */}
                <Text p="5px" fontSize="lg">
                  <span style={{ display: 'inline-block', width: '190px' }}>Discount Percentage:</span>
                  {inEditingMode && restaurant.is_offer && restaurant.offer_on === "restaurant" ? (
                    <Input type="number" name="discount_percentage" value={restaurant.discount_percentage} onChange={(event) => setRestaurant({ ...restaurant, discount_percentage: event.target.value <= 100 ? (event.target.value >=0 ? event.target.value : 0) : 100 })} />
                  ) : (
                    `${restaurant.discount_percentage ?? 0} %`
                  )}
                </Text>

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
          {Array.isArray(restaurant.menu) && restaurant.menu.length > 0 ? ( 
            restaurant.menu.map((menuItem) => (
            
            <Box key={menuItem.item_id} bg="white" p="20px" rounded="md" w="100%" border="1px solid #ccc">
              {/* Menu Item Image */}
              <Image mb="15px" src={menuItem.item_image_path !== undefined ? `https://foodvaganza.s3.amazonaws.com/${restaurant_id}/${menuItem.item_image_path}` : `https://foodvaganza.s3.amazonaws.com/default_image.jpg`} alt={menuItem.item_name} w="100%" h="200px" objectFit="cover" />
              
              {inEditMenu ? ( 
                <>
                  <Text fontSize="md" fontWeight="medium" mt="5px">Update item Image:</Text>
                  <input type="file" onChange={(event) => initiateImageUpload(event,menuItem.item_id)} />
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

                      {/* offer_type  */}
                      <Flex alignItems="center" mt="10px">
                        <Text fontSize="md" fontWeight="medium" width="80px">Discount Type:</Text>
                        {restaurant.offer_on === 'menu_item' ? (
                          <Select name="offer_type" value={sizePrice.offer_type} onInput={(event) => { updateSizePrice(menuItem, index, 'offer_type', event.target.value); }}>
                            <option value={null || ""}>None</option>
                            <option value="percentage">Percentage</option>
                            {/* <option value="restaurant">Label</option> label option to add in future */}
                          </Select>
                        ) : (
                          <Text>{sizePrice.offer_type || "None"}</Text>
                        )}
                      </Flex>

                      {/* percentage discount */}
                      <Flex alignItems="center" mt="10px">
                        <Text fontSize="md" fontWeight="medium" width="80px">Discount Percentage:</Text>
                        {restaurant.offer_on === 'menu_item' ? (
                          <Input type="number" name="discount_percentage" value={sizePrice.discount_percentage || "0"} onInput={(event) => { updateSizePrice( menuItem, index, 'discount_percentage', event.target.value <= 100 ? (event.target.value >= 0 ? event.target.value : 0) : 100 ); }}
                            disabled={sizePrice.offer_type !== 'percentage'}
                          />
                        ) : (
                          <Text>{`${sizePrice.discount_percentage || "0"}%`}</Text>
                        )}
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
                            <Text fontWeight="bold" ml="2">
                              <Icon as={TbDiscountCheckFilled} color="green.500" boxSize={5} mr="5px"/>
                              {`$${calculateDiscountedPrice(sizePrice.price, restaurant.discount_percentage)}${sizePrice.type ? ` per ${sizePrice.type}` : ''}`}
                            </Text>
                          </>
                        ) : (
                          <>
                            {restaurant.is_offer && sizePrice.offer_type === 'percentage' ? (
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

                )}
              {inEditMenu ? ( "" ):(
                <Button colorScheme="red" mt="35px" onClick={() => deleteMenuItem(menuItem.item_id)}> Delete Item </Button>
              )}
            </Box>
          ))
        ) : (
          <Text p="5px">No menu items added. Click <Text as="span" fontWeight="bold" color="purple.500">"Add New Menu Item"</Text> to add a menu item.</Text>
        )}
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
