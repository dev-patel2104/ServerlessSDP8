import { getAllReservationsbyRestaurantID } from "../ReservationServices/ReservationService";
import { getAllRestaurants } from "../RestaurantServices/RestaurantService";

export const getAllReservationsForPartner = async () => {
    const partnerEmail = localStorage.getItem("foodvaganzaUser");

    const listRestaurants = await getAllRestaurants();

    const partnerRestaurants = listRestaurants.filter(restaurant => restaurant.email_id === partnerEmail);

    const reservations = [];

    for(const restaurant of partnerRestaurants){
        const response = await getAllReservationsbyRestaurantID(restaurant.restaurant_id);
        
        response.forEach(item => {
            reservations.push(item);
          });
        
    }

    const output = [];
    

    for (const reservation of reservations){
        output.push({
            id: reservation.reservation_id,
            dateTime: reservation.reservation_time,
            customerName: reservation.customer_id
        });
    }

 
    return output;
}