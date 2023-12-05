const https = require("https");

exports.lambdaHandler = async (event) => {
  // console.log('Received event:', JSON.stringify(event, null, 2));

  try {
    const intentName = event.sessionState.intent.name;

    switch (intentName) {
      case "getRestaurants":
        return await handleGetRestaurants(event);
      case "getRestaurantLocation":
        return await handleGetRestaurantLocation(event);
      case "getOpeningTimes":
        return await handleGetOpeningTime(event);
      case "editOpeningTimes":
        return await handleEditOpeningTimes(event);

      case "submitRestaurantReview":
        return await handleSubmitRestaurantReview(event);

      case "getReviewRestaurant":
        return await handleGetReviewRestaurant(event);

      case "getMenuAvailability":
        return await handleGetMenuAvailability(event);

      case "getRatingsRestaurant":
        return await handleGetRatingsRestaurant(event);

      case "getReservations":
        return await handleGetReservations(event);

      case "cancelReservation":
        return await handleEditReservation(event);

      default:
        return buildResponse(event, "Sorry, I didn’t understand that.");
    }
  } catch (error) {
    console.error("Error:", error);
    return buildResponse(
      event,
      "An error occurred while processing your request."
    );
  }
};

async function handleGetRestaurants(event) {
  try {
    const allRestaurants = await httpGet(
      "hc4eabn0s8.execute-api.us-east-1.amazonaws.com",
      "/restaurants"
    );

    if (allRestaurants.length === 0) {
      return buildResponse(
        event,
        "There are currently no restaurants available."
      );
    }

    let responseMessage = "The following restaurants are currently available: ";
    allRestaurants.forEach((restaurant, index) => {
      responseMessage += `${index + 1}. ${restaurant.name} `;
    });

    return buildResponse(event, responseMessage);
  } catch (error) {
    console.error("Error getting restaurants:", error);
    return buildResponse(
      event,
      "Sorry, there was an error fetching the restaurant list."
    );
  }
}

async function handleGetRestaurantLocation(event) {
  const restaurantName =
    event.sessionState.intent.slots.restaurant_name.value.interpretedValue
      .trim()
      .toLowerCase();
  const allRestaurants = await httpGet(
    "hc4eabn0s8.execute-api.us-east-1.amazonaws.com",
    "/restaurants"
  );
  const restaurantId = getRestaurantIdByName(allRestaurants, restaurantName);

  if (!restaurantId) {
    return buildResponse(
      event,
      "Sorry, I couldn’t find a restaurant with that name."
    );
  }

  const restaurantDetails = await getRestaurantInfo(restaurantId);
  const locationMessage = `${restaurantDetails.name} is located at ${restaurantDetails.address}.`;

  return buildResponse(event, locationMessage);
}

async function handleGetOpeningTime(event) {
  const restaurantName =
    event.sessionState.intent.slots.restaurant_name.value.interpretedValue
      .trim()
      .toLowerCase();
  const allRestaurants = await httpGet(
    "hc4eabn0s8.execute-api.us-east-1.amazonaws.com",
    "/restaurants"
  );
  const restaurantId = getRestaurantIdByName(allRestaurants, restaurantName);

  if (!restaurantId) {
    return buildResponse(
      event,
      "Sorry, I couldn’t find a restaurant with that name."
    );
  }

  const restaurantDetails = await getRestaurantInfo(restaurantId);
  const openingTimeMessage = `The opening hours for ${restaurantDetails.name} are from ${restaurantDetails.start_time} to ${restaurantDetails.end_time}.`;

  return buildResponse(event, openingTimeMessage);
}

async function handleViewBookingInformation(event) {
  const restaurantName =
    event.sessionState.intent.slots.restaurant_name.value.interpretedValue
      .trim()
      .toLowerCase();
  const timeDuration =
    event.sessionState.intent.slots.time_duration.value.interpretedValue;

  const allRestaurants = await httpGet(
    "hc4eabn0s8.execute-api.us-east-1.amazonaws.com",
    "/restaurants"
  );
  const restaurantId = getRestaurantIdByName(allRestaurants, restaurantName);

  if (!restaurantId) {
    return buildResponse(
      event,
      "Sorry, I couldn’t find a restaurant with that name."
    );
  }

  const allReservations = await httpGet(
    "v2occhudvh.execute-api.us-east-1.amazonaws.com",
    "/reservations"
  );
  const { confirmedCount, unconfirmedCount } = countReservations(
    allReservations,
    restaurantId,
    timeDuration
  );

  const messageContent = `For ${timeDuration}, you have ${confirmedCount} confirmed and ${unconfirmedCount} unconfirmed reservations.`;
  return buildResponse(event, messageContent);
}

async function getRestaurantInfo(restaurantId) {
  try {
    const restaurantDetails = await httpGet(
      "hc4eabn0s8.execute-api.us-east-1.amazonaws.com",
      `/restaurants/${restaurantId}`
    );
    return restaurantDetails;
  } catch (error) {
    console.error("Error fetching restaurant info:", error);
    throw new Error("Unable to fetch restaurant information.");
  }
}

function getRestaurantIdByName(allRestaurants, restaurantName) {
  console.log("Searching for restaurant:", restaurantName);
  // console.log('All restaurants:', JSON.stringify(allRestaurants, null, 2));

  try {
    const restaurant = allRestaurants.find((r) => {
      console.log("Comparing with:", r.name.trim().toLowerCase());
      return r.name.trim().toLowerCase() === restaurantName;
    });
    return restaurant ? restaurant.restaurant_id : null;
  } catch (error) {
    console.error("Error in getRestaurantIdByName:", error);
    return null;
  }
}

function countReservations(allReservations, restaurantId, timeDuration) {
  const startEndDates = determineDateRange(timeDuration);
  const startTimestamp = startEndDates.start.getTime();
  const endTimestamp = startEndDates.end.getTime();

  let confirmedCount = 0,
    unconfirmedCount = 0;

  allReservations.forEach((reservation) => {
    if (
      reservation.restaurant_id === restaurantId &&
      reservation.reservation_time >= startTimestamp &&
      reservation.reservation_time <= endTimestamp
    ) {
      if (reservation.reservation_status === "confirmed") {
        confirmedCount++;
      } else {
        unconfirmedCount++;
      }
    }
  });

  return { confirmedCount, unconfirmedCount };
}

function determineDateRange(timeDuration) {
  const now = new Date();
  let start, end;

  switch (timeDuration) {
    case "today":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(start);
      break;
    case "this week":
      start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay()
      );
      end = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + 6
      );
      break;
    case "this month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      break;
    default: // default to today
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(start);
      break;
  }

  return { start, end };
}

async function handleEditOpeningTimes(event) {
  const restaurantName =
    event.sessionState.intent.slots.restaurant_name.value.interpretedValue
      .trim()
      .toLowerCase();
  const newOpeningTime =
    event.sessionState.intent.slots.new_opening_time.value.interpretedValue;
  const newClosingTime =
    event.sessionState.intent.slots.new_closing_time.value.interpretedValue;

  const allRestaurants = await httpGet(
    "hc4eabn0s8.execute-api.us-east-1.amazonaws.com",
    "/restaurants"
  );
  const restaurantId = getRestaurantIdByName(allRestaurants, restaurantName);

  if (!restaurantId) {
    return buildResponse(
      event,
      "Sorry, I couldn’t find a restaurant with that name."
    );
  }

  const updateResponse = await updateRestaurantTimes(
    restaurantId,
    newOpeningTime,
    newClosingTime
  );

  return buildResponse(event, updateResponse);
}

async function updateRestaurantTimes(
  restaurantId,
  newOpeningTime,
  newClosingTime
) {
  try {
    // First, get the current details of the restaurant
    const restaurantDetails = await getRestaurantInfo(restaurantId);

    // Update the opening and closing times
    restaurantDetails.start_time = newOpeningTime;
    restaurantDetails.end_time = newClosingTime;

    const response = await httpPut(
      "hc4eabn0s8.execute-api.us-east-1.amazonaws.com",
      `/restaurants/${restaurantId}`,
      restaurantDetails
    );
    return `The opening times for the restaurant have been updated to: ${newOpeningTime} - ${newClosingTime}`;
  } catch (error) {
    console.error("Error updating restaurant times:", error);
    throw new Error("Unable to update restaurant times.");
  }
}

async function handleGetReviewRestaurant(event) {
  const restaurantName =
    event.sessionState.intent.slots.restaurant_name.value.interpretedValue
      .trim()
      .toLowerCase();
  const allRestaurants = await httpGet(
    "hc4eabn0s8.execute-api.us-east-1.amazonaws.com",
    "/restaurants"
  );
  const restaurantId = getRestaurantIdByName(allRestaurants, restaurantName);

  if (!restaurantId) {
    return buildResponse(
      event,
      "Sorry, I couldn’t find a restaurant with that name."
    );
  }

  const restaurantDetails = await getRestaurantInfo(restaurantId);
  const reviews = formatReviews(restaurantDetails.reviews);
  const reviewCount = restaurantDetails.reviews.length;
  const reviewMessage = `Your restaurant currently has ${reviewCount} reviews. Here are the reviews: ${reviews}`;

  return buildResponse(event, reviewMessage);
}

function formatReviews(reviews) {
  return reviews
    .map((review, index) => (index > 0 ? "\n" : "") + `"${review.review}"`)
    .join("");
}

async function handleGetMenuAvailability(event) {
  const restaurantName =
    event.sessionState.intent.slots.restaurant_name.value.interpretedValue
      .trim()
      .toLowerCase();
  const allRestaurants = await httpGet(
    "hc4eabn0s8.execute-api.us-east-1.amazonaws.com",
    "/restaurants"
  );
  const restaurantId = getRestaurantIdByName(allRestaurants, restaurantName);

  if (!restaurantId) {
    return buildResponse(
      event,
      "Sorry, I couldn’t find a restaurant with that name."
    );
  }

  const restaurantDetails = await getRestaurantInfo(restaurantId);
  const availableMenuItems = restaurantDetails.menu.filter(
    (item) => item.is_available
  );

  const messageContent = formatAvailableMenuItems(availableMenuItems);

  return buildResponse(event, messageContent);
}

function formatAvailableMenuItems(menuItems) {
  if (menuItems.length === 0) {
    return "There are currently no available menu items.";
  }
  // Create a string that lists each available menu item
  const formattedMenuItems = menuItems
    .map((item) => `${item.item_name} (${item.category})`)
    .join(", ");
  return `The available menu items are: ${formattedMenuItems}`;
}

async function handleGetRatingsRestaurant(event) {
  const restaurantName =
    event.sessionState.intent.slots.restaurant_name.value.interpretedValue
      .trim()
      .toLowerCase();
  const allRestaurants = await httpGet(
    "hc4eabn0s8.execute-api.us-east-1.amazonaws.com",
    "/restaurants"
  );
  const restaurantId = getRestaurantIdByName(allRestaurants, restaurantName);

  if (!restaurantId) {
    return buildResponse(
      event,
      "Sorry, I couldn’t find a restaurant with that name."
    );
  }

  const restaurantDetails = await getRestaurantInfo(restaurantId);
  console.log(restaurantDetails);
  const ratingsMessage = formatRatingsMessage(restaurantDetails.reviews);
  console.log(ratingsMessage);

  return buildResponse(event, ratingsMessage);
}

function formatRatingsMessage(reviews) {
  if (!reviews || reviews.length === 0) {
    return "There are currently no ratings for this restaurant.";
  }

  // Calculate the average rating
  const ratings = reviews.map((review) => parseInt(review.rating));
  const sumRatings = ratings.reduce((sum, rating) => sum + rating, 0);
  const avgRating = (sumRatings / ratings.length).toFixed(1); // One decimal place

  // Create a string that lists each rating
  const ratingsList = ratings.join(", ");

  return `Your restaurant has an average rating of ${avgRating} stars. Here are the ratings: ${ratingsList}`;
}

async function handleGetReservations(event) {
  const restaurantName =
    event.sessionState.intent.slots.restaurant_name.value.interpretedValue
      .trim()
      .toLowerCase();
  const allRestaurants = await httpGet(
    "hc4eabn0s8.execute-api.us-east-1.amazonaws.com",
    "/restaurants"
  );
  const restaurantId = getRestaurantIdByName(allRestaurants, restaurantName);

  if (!restaurantId) {
    return buildResponse(
      event,
      "Sorry, I couldn’t find a restaurant with that name."
    );
  }

  const reservations = await getReservations(restaurantId);
  const reservationsMessage = formatReservationsMessage(reservations);

  return buildResponse(event, reservationsMessage);
}

async function getReservations(restaurantId) {
  try {
    const response = await httpGet(
      "p4mp4ngglh.execute-api.us-east-1.amazonaws.com",
      `/items?restaurant_id=${restaurantId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw new Error("Unable to fetch reservations.");
  }
}

function formatReservationsMessage(reservations) {
  if (!reservations || reservations.length === 0) {
    return "There are currently no reservations for this restaurant.";
  }

  let message = "Here are the current list of reservations: ";
  reservations.forEach((reservation, index) => {
    const itemsOrdered = reservation.items
      .map((item) => item.item_name)
      .join(", ");
    message += `${index + 1}. Reservation ID: ${
      reservation.reservation_id
    }. Items ordered: ${itemsOrdered}. `;
  });

  return message;
}

async function handleSubmitRestaurantReview(event) {
  const restaurantName =
    event.sessionState.intent.slots.restaurant_name.value.interpretedValue
      .trim()
      .toLowerCase();
  const reviewText =
    event.sessionState.intent.slots.reviewText.value.interpretedValue;
  const customerId =
    event.sessionState.intent.slots.customer_id.value.interpretedValue;
  const rating = event.sessionState.intent.slots.rating.value.interpretedValue;

  const allRestaurants = await httpGet(
    "hc4eabn0s8.execute-api.us-east-1.amazonaws.com",
    "/restaurants"
  );
  const restaurantId = getRestaurantIdByName(allRestaurants, restaurantName);

  if (!restaurantId) {
    return buildResponse(
      event,
      "Sorry, I couldn’t find a restaurant with that name."
    );
  }

  const response = await submitReview(
    restaurantId,
    reviewText,
    customerId,
    rating
  );

  if (response.success) {
    return buildResponse(event, `Thanks for your review for ${restaurantName}`);
  } else {
    return buildResponse(
      event,
      "Sorry, there was an error submitting your review."
    );
  }
}

async function submitReview(restaurantId, reviewText, customerId, rating) {
  try {
    const restaurantDetails = await getRestaurantInfo(restaurantId);

    // Construct the new review object
    const newReview = {
      customer_id: customerId,
      rating: rating,
      review: reviewText,
    };

    restaurantDetails.reviews.push(newReview);

    console.log(`Data being sent: ${JSON.stringify(restaurantDetails)}`);

    // Submit the updated restaurant details
    const response = await httpPut(
      "hc4eabn0s8.execute-api.us-east-1.amazonaws.com",
      `/restaurants/${restaurantId}`,
      restaurantDetails
    );
    return { success: true, response };
  } catch (error) {
    console.error("Error submitting review:", error);
    return { success: false };
  }
}

async function httpPut(hostname, path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let response = "";
      res.on("data", (chunk) => (response += chunk));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(response));
        } else {
          console.error(
            `PUT request failed with status code: ${res.statusCode}`
          );
          reject(
            new Error(`PUT request failed with status code: ${res.statusCode}`)
          );
        }
      });
    });

    req.on("error", (error) => {
      console.error("Error in httpPut:", error);
      reject(error);
    });

    req.write(JSON.stringify(data));
    req.end();
  });
}

async function handleEditReservation(event) {
  const restaurantName =
    event.sessionState.intent.slots.restaurant_name.value.interpretedValue
      .trim()
      .toLowerCase();
  const reservationId =
    event.sessionState.intent.slots.reservation_id.value.interpretedValue.trim();

  const allRestaurants = await httpGet(
    "hc4eabn0s8.execute-api.us-east-1.amazonaws.com",
    "/restaurants"
  );
  const restaurantId = getRestaurantIdByName(allRestaurants, restaurantName);

  if (!restaurantId) {
    return buildResponse(
      event,
      "Sorry, I couldn’t find a restaurant with that name."
    );
  }

  const cancellationResponse = await deleteReservation(reservationId);
  const message = `The reservation ${reservationId} has been canceled.`;

  return buildResponse(event, message);
}

async function deleteReservation(reservationId) {
  try {
    const response = await httpDelete(
      "v2occhudvh.execute-api.us-east-1.amazonaws.com",
      `/reservations/${reservationId}`
    );
    return response;
  } catch (error) {
    console.error("Error deleting reservation:", error);
    throw new Error("Unable to delete the reservation.");
  }
}

async function httpDelete(hostname, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve("Reservation deleted successfully.");
      } else {
        console.error(`Request failed with status code: ${res.statusCode}`);
        reject(new Error(`Request failed with status code: ${res.statusCode}`));
      }
    });

    req.on("error", (error) => {
      console.error("Error in httpDelete:", error);
      reject(error);
    });
    req.end();
  });
}

async function httpGet(hostname, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          console.error(`Request failed with status code: ${res.statusCode}`);
          reject(
            new Error(`Request failed with status code: ${res.statusCode}`)
          );
        }
      });
    });

    req.on("error", (error) => {
      console.error("Error in httpGet:", error);
      reject(error);
    });
    req.end();
  });
}

function buildResponse(event, messageContent) {
  return {
    sessionState: {
      dialogAction: {
        type: "Close",
      },
      intent: {
        name: event.sessionState.intent.name,
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: messageContent,
      },
    ],
  };
}
