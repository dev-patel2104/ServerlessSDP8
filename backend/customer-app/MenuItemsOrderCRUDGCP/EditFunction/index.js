const functions = require('@google-cloud/functions-framework');
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();


functions.http('items-edit', async (req, res) => {
  try {
    const data = req.body; 

    const collection = firestore.collection('menu-items-order');

    const querySnapshot = await collection.where('reservation_id', '==', data.reservation_id).get();

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const documentRef = collection.doc(querySnapshot.docs[0].id);
    const documentSnapshot = await documentRef.get();

    if (!documentSnapshot.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await documentRef.update(data);

    return res.status(200).json({ message: 'Document updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
