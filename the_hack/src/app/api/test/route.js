export default async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {

    const response = {"peepee": "poopoo"}

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response?.status || 500).json({ error: 'An error occurred' });
  }
}