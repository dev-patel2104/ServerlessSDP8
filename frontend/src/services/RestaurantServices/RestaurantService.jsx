export const getAllRestaurants = async () => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await fetch(`https://hc4eabn0s8.execute-api.us-east-1.amazonaws.com/restaurants`, options);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return null;
    }
}

export const getRestaurant = async (restaurantID) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await fetch(`https://hc4eabn0s8.execute-api.us-east-1.amazonaws.com/restaurants/${restaurantID}`, options);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        return null;
    }
}



export const deleteRestaurant = async (restaurantID) => {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await fetch(`https://hc4eabn0s8.execute-api.us-east-1.amazonaws.com/restaurants/${restaurantID}`, options);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        return null;
    }
}

export const updateRestaurantDetails = async (requestJSON) => {

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            requestJSON
            // {
            //     restaurant_id: requestJSON.restaurantID,
            //     name: requestJSON.name,
            //     address: requestJSON.address,
            //     start_time: requestJSON.start_time,
            //     end_time: requestJSON.end_time,
            //     contact: requestJSON.contact,
            //     fb_link: requestJSON.fb_link,
            //     insta_link: requestJSON.insta_link,
            //     store_link: requestJSON.store_link,
            //     online_delivery: requestJSON.online_delivery,
            //     tagline: requestJSON.tagline,
            //     max_booking_capacity: requestJSON.max_booking_capacity,
            //     image_path: requestJSON.image_path,
            //     is_new: requestJSON.is_new,
            //     menu: requestJSON.menu
            // }
            )
    }

    try {
        const response = await fetch(`https://hc4eabn0s8.execute-api.us-east-1.amazonaws.com/restaurants`, options);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error Updating restaurant details:', error);
        return null;
    }
}