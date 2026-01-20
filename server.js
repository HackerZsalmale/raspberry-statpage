const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;


app.use(express.static('public'));


app.get('/api/stats', (req, res) => {
    fs.readFile('stats.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send("Error reading stats");
        res.json(JSON.parse(data));
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
