export const createItems = async (restaurant_id, reservation_id, items) => {

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                restaurant_id: restaurant_id,
                reservation_id: reservation_id,
                items: items,
                type: "new"
            })
    }

    try {
        const response = await fetch(`https://p4mp4ngglh.execute-api.us-east-1.amazonaws.com/items`, options);

        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error('Error creating items:');
        return null;
    }

}

export const editItems = async (restaurant_id, reservation_id, items) => {

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                restaurant_id: restaurant_id,
                reservation_id: reservation_id,
                items: items,
                type: "edit"
            })
    }

    try {
        const response = await fetch(`https://p4mp4ngglh.execute-api.us-east-1.amazonaws.com/items`, options);

        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error('Error creating items:');
        return null;
    }

}

export const getItemsReservationID = async (reservation_id) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await fetch(`https://p4mp4ngglh.execute-api.us-east-1.amazonaws.com/items/${reservation_id}`, options);

        const data = await response.json();
        if(data?.error){
            return [];
        }
        return data;
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    }
}

export const getItemsRestaurantID = async (restaurant_id) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await fetch(`https://p4mp4ngglh.execute-api.us-east-1.amazonaws.com/items?restaurant_id=${restaurant_id}`, options);

        const data = await response.json();
        if(data?.error){
            return [];
        }
        return data;
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    }
}

export const deleteItems = async (reservation_id) => {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await fetch(`https://p4mp4ngglh.execute-api.us-east-1.amazonaws.com/items/${reservation_id}`, options);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting items:', error);
        return null;
    }
}