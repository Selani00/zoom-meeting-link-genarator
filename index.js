import express from 'express';
import cors from 'cors'
import bodyParser from "body-parser";
import zoomRoute from './route/zoom_route.js';

const app = express();
app.use(express.json());
const port = 6100;

app.use(
    cors({
      origin: '*',
      credentials: true,
    })
)

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/api', zoomRoute);

app.listen(port, () => {
    console.log(`Server is running , http://localhost:${port}`);
});
