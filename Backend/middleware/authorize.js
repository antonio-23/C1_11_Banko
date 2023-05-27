import jwt from "jsonwebtoken";
import { db } from "../connect.js";
import { decrypt, encrypt } from "./hash.js";

/*~~~~~~~~~~~~~~~~~~~~~~~~~~ AUTORYZACJA ~~~~~~~~~~~~~~~~~~~~~~~~~~*/

export const authorize_klient = (req, res) => {
  let token = null;
  const id = req.body;
  const user = decrypt(id.user)
  if (id !== null){
    const q = "SELECT token FROM bank.klient  WHERE id = ?";
    db.query(q, [user], (error, data) => {
    if (error) {
      return res.status(500).json(error);
    }
  if (data.length) {
    token = data[0].token;
  }else return res.status(401).json("Nieprtawidłowy token");
  if (!token) {
    // przekierowanie na stronę logowania z informacją, że trzeba się zalogować
    res.status(404).json("Nieprtawidłowy token");
  }

  try {
    // weryfikujemy token
    const decodedToken = jwt.verify(token, "secretKey");
    const id = encrypt(decodedToken.id)
    res.status(200).json({user: id});
    // dodajemy zdekodowany token do obiektu żądania
    req.user = decodedToken;
    
  } catch (error) {
          res.status(402).json("Nieprtawidłowy token");
  }
})
}}

export const authorize_pracownik = (req, res) => {
  let token = null;
  const id = req.body;
  const user = decrypt(id.user)
  if (id !== null){
    const q = "SELECT token FROM bank.pracownicy  WHERE id = ?";
    db.query(q, [user], (error, data) => {
    if (error) {
      return res.status(500).json(error);
    }
  if (data.length) {
    token = data[0].token;
  }else return res.status(401).json("Nieprtawidłowy token");
  if (!token) {
    // przekierowanie na stronę logowania z informacją, że trzeba się zalogować
    res.status(404).json("Nieprtawidłowy token");
  }

  try {
    // weryfikujemy token
    const decodedToken = jwt.verify(token, "secretKey");
    const id = encrypt(decodedToken.id)
    res.status(200).json({user: id});
    // dodajemy zdekodowany token do obiektu żądania
    req.user = decodedToken;
    
  } catch (error) {
          res.status(402).json("Nieprtawidłowy token");
  }
})
}}