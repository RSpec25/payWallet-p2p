const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
const rootRouter = require('./routes/index');

// access control allow origin/methods.... (*) means all domain can access the B.com web services  CORS  preflight req
//parser...
app.use(cors());
app.use(express.json());
app.use('/api/v1', rootRouter);
app.get('/health', () => {
    console.log("server is healthy")
})

app.listen(PORT, () => {
    console.log(`Server running successfully on port ${PORT}`);
})