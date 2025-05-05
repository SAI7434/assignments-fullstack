const express = require('express');
const cors = require('cors');
const { parseResume } = require('./parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/parse', async (req, res) => {
  try {
    const { resumeText } = req.body;
    const parsed = await parseResume(resumeText);
    res.json(parsed);
  } catch (error) {
    console.error('Parsing error:', error.message);
    res.status(500).json({ error: 'Failed to parse resume' });
  }
});

app.listen(5000, () => {
  console.log('Server is running at http://localhost:5000');
});
