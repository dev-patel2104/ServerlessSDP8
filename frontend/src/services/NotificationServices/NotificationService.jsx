export const notifyUserAddRestaurant = async (email_id, restaurant_id) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": email_id,
          "type" : "partner",
          "UserId": restaurant_id
        })
    }

    try {
        const response = await fetch(`https://e4x258613e.execute-api.us-east-1.amazonaws.com/subscribe`, options);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending notification request:', error);
        return null;
    }
}
