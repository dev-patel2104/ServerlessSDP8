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
                is_notified: false
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

export const editReservation = async (reservation_id, restaurant_id, reservation_time, customer_id, reservation_status, is_notified) => {

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
                is_notified: is_notified
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
        return data;
    } catch (error) {
        console.error('Error fetching reservation:', error);
        return null;
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
        return data;
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return null;
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
        return data;
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return null;
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