const functions = require('@google-cloud/functions-framework');
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();


functions.http('items-get-restaurant-id', async (req, res) => {
  try {
    const data = req.body; 

    const collection = firestore.collection('menu-items-order');

    const querySnapshot = await collection.where('restaurant_id', '==', data.restaurant_id).get();

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'No matching documents found' });
    }

    const documents = [];

    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(documents);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
