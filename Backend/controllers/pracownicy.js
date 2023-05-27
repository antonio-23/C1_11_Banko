import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { db } from '../connect.js';
import { encrypt } from '../middleware/hash.js';

/*~~~~~~~~~~~~~~~~~~~~~~~~~~ LOGOWANIE ~~~~~~~~~~~~~~~~~~~~~~~~~~*/

export const login = (req, res) => {
    const q = "SELECT id, password FROM bank.pracownicy WHERE id = ?";
    db.query(q, [req.body.id], (err, data) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (!data[0]) {
        return res.status(404).json("Niepoprawny id lub hasło");
      }
      const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
      if (!checkPassword) {
        return res.status(404).json("Niepoprawny id lub hasło");
      }
      const id = encrypt(data[0].id)
      const token = jwt.sign({ id: data[0].id }, "secretKey", { expiresIn: '1h' });
      const q2 = "UPDATE bank.pracownicy SET token = ? WHERE (id = ?)";
      db.query(q2, [token, data[0].id], (error, result) => {
        if (error) {
          return res.status(500).json(error);
        }
      })
      const redirectPath = "/pracownicy";
  
      const { password, ...others } = data[0];
      res.status(200)
        .cookie("accessToken", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .json({token: token, redirectPath: redirectPath, id: id });
    });
  };
  
  /*~~~~~~~~~~~~~~~~~~~~~~~~~~ WYLOGOWANIE ~~~~~~~~~~~~~~~~~~~~~~~~~~*/
  
    export const logout = (req, res)=>{
      res.clearCookie("accessToken",{
        secure:true,
        sameSite:"none"
      }).status(200).send("Wylogowano")
    };
  
  