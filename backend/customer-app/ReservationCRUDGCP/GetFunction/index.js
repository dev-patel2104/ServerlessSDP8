const functions = require('@google-cloud/functions-framework');
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();


functions.http('reservation-get', async (req, res) => {
  try {
    const data = req.body; 

    const collection = firestore.collection('reservations');

    const querySnapshot = await collection.where('reservation_id', '==', data.reservation_id).get();

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const document = querySnapshot.docs[0].data();

    return res.status(200).json(document);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
