const functions = require('@google-cloud/functions-framework');
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();


functions.http('reservation-create', async (req, res) => {
  try {
    const data = req.body; 

    const collection = firestore.collection('reservations');

    const documentRef = await collection.add(data);
    const documentId = documentRef.id;

    return res.status(200).json({ message: `Document created with ID: ${documentId}` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
