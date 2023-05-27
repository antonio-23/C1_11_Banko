import express from 'express';
const app = express()
import cors from 'cors';
import klienciRoutes from "./routes/klienci.js"

app.use(cors()); // Dodaj middleware CORS
app.use(express.json())
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // Zezwól na dostęp dla wszystkich adresów
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Zezwól na żądania GET, POST, PUT i DELETE
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Zezwól na nagłówki X-Requested-With, Content-Type itp.
  next();
});

app.use("/api/klienci", klienciRoutes);

app.listen(8080, () => {
    console.log("BACKEND working!");
}); 