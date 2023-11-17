export const createReservation = async (restaurant_id, reservation_time, customer_id, reservation_status) => {

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                restaurant_id: restaurant_id,
                reservation_time: reservation_time,
                customer_id: customer_id,
                reservation_status: reservation_status,
                is_notified: false,
                is_restaurant_notified: false
            })
    }

    try {
        const response = await fetch(`https://v2occhudvh.execute-api.us-east-1.amazonaws.com/reservations`, options);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating reservation:');
        return null;
    }

}

export const editReservation = async (reservation_id, restaurant_id, reservation_time, customer_id, reservation_status, is_notified, is_restaurant_notified) => {

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                reservation_id: reservation_id,
                restaurant_id: restaurant_id,
                reservation_time: reservation_time,
                customer_id: customer_id,
                reservation_status: reservation_status,
                is_notified: is_notified,
                is_restaurant_notified: is_restaurant_notified
            })
    }

    try {
        const response = await fetch(`https://v2occhudvh.execute-api.us-east-1.amazonaws.com/reservations`, options);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error editing reservation:');
        return null;
    }

}

export const getReservation = async (reservation_id) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await fetch(`https://v2occhudvh.execute-api.us-east-1.amazonaws.com/reservations/${reservation_id}`, options);

        const data = await response.json();
        if(data?.error){
            return [];
        }
        return data;
    } catch (error) {
        console.error('Error fetching reservation:', error);
        return [];
    }
}

export const getAllReservations = async () => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await fetch(`https://v2occhudvh.execute-api.us-east-1.amazonaws.com/reservations`, options);

        const data = await response.json();
        if(data?.error){
            return [];
        }
        return data;
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return [];
    }
}

export const getAllReservationsbyCustomerID = async (customer_id) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await fetch(`https://v2occhudvh.execute-api.us-east-1.amazonaws.com/reservations?customer_id=${customer_id}`, options);

        const data = await response.json();
        if(data?.error){
            return [];
        }
        return data;
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return [];
    }
}

export const getAllReservationsbyRestaurantID = async (restaurant_id) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await fetch(`https://v2occhudvh.execute-api.us-east-1.amazonaws.com/reservations/restaurants/${restaurant_id}`, options);

        const data = await response.json();
        if(data?.error){
            return [];
        }
        return data;
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return [];
    }
}

export const deleteReservation = async (reservation_id) => {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await fetch(`https://v2occhudvh.execute-api.us-east-1.amazonaws.com/reservations/${reservation_id}`, options);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting reservation:', error);
        return null;
    }
}