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