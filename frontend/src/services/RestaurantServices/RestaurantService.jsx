export const getRestaurant = async (restaurant_id) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await fetch(`https://hc4eabn0s8.execute-api.us-east-1.amazonaws.com/restaurants/${restaurant_id}`, options);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        return null;
    }
}

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
