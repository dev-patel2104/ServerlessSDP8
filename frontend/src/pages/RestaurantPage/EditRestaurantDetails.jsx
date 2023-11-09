import React, { useState, useEffect } from 'react';
import { Flex, Text, Icon, Box, VStack, HStack, Image, Button, Input, Textarea } from '@chakra-ui/react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

function RestaurantDetails() {
  const { restaurant_id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [inEditingMode, setInEditingMode] = useState(false); 

  useEffect(() => {
    const fetchRestaurant = async (restaurant_id) => {
      const sampleData = {
        name: 'Restaurant  Name 1',
        tagline: 'Tagline 1',
        address: 'Restaurant Address',
        contact: 'Restaurant Contact',
        start_time: '08:00 AM',
        end_time: '10:00 PM',
        online_delivery: true,
        image_path: 'aa8e57df-3a13-4671-be37-3ac4b546ce6b.jpg',
        menu: [
          {
            item_id: '1',
            item_name: 'Menu Item 1',
            item_description: 'Description for Menu Item 1',
            category: 'Category 1',
            item_type: 'Type 1',
            item_image_path: 'margherita_pizza.jpg',
            is_available: true,
          },
        ],
      };
      setRestaurant(sampleData);
      setLoading(false);
    };
    fetchRestaurant(restaurant_id);
  }, [restaurant_id]);

  const enableEditMode = () => {
    setInEditingMode(true);
  };

  const saveEditChanges = () => {
    setInEditingMode(false);
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
          <Text fontSize="4xl" p="20px" fontWeight="bold">
            {inEditingMode ? (
              <Input name="name" value={restaurant.name} onChange={(event) => setRestaurant({ ...restaurant, name: event.target.value })} />
            ) : (
              restaurant.name
            )}
          </Text>
          <Box bg="white" p="20px" ml="40px" rounded="md">
            <Text p="5px" fontSize="lg">
              {inEditingMode ? (
                <Textarea name="tagline" value={restaurant.tagline} onChange={(event) => setRestaurant({ ...restaurant, tagline: event.target.value })} />
              ) : (
                restaurant.tagline
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





        <br/><br/>

        <Box ml="auto" mt="20px">
          <NavLink to="/restaurants" p="20px">
              <Icon as={BsArrowLeft} color='blackAlpha.900' boxSize={6} /> Back to Restaurant List
          </NavLink>
        </Box>
        <Box mt="50px" h="150px">

        </Box>
      </Flex>
    </Flex>
  );
}

export default RestaurantDetails;

function updateItemsInMenu(menu, itemId, updatedItem) {
  return menu.map((item) => (item.item_id === itemId ? updatedItem : item));
}
