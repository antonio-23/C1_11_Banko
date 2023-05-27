import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { db } from '../connect.js';
import { encrypt } from '../middleware/hash.js';

/*~~~~~~~~~~~~~~~~~~~~~~~~~~ LOGOWANIE ~~~~~~~~~~~~~~~~~~~~~~~~~~*/

export const login = (req, res) => {
  const q = "SELECT id , password FROM bank.klienci WHERE PESEL = ?";
  db.query(q, [req.body.PESEL], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (!data[0]) {
      return res.status(404).json("Niepoprawny PESEL lub hasło");
    }
    const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
    if (!checkPassword) {
      return res.status(404).json("Niepoprawny PESEL lub hasło");
    }
    const id = encrypt(data[0].id)
    const token = jwt.sign({ id: data[0].id }, "secretKey", { expiresIn: '1h' });
    const q2 = "UPDATE bank.klienci SET token = ? WHERE (id = ?)";
    db.query(q2, [token, data[0].id], (error, result) => {
      if (error) {
        return res.status(500).json(error);
      }
    })
    const redirectPath = "/klient";

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

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~ SALDO ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

export const balance = (req,res) => {
  const user = decrypt(req.body.user);
  const q = "SELECT saldo FROM bank.saldo_konta WHERE id =  ?";
  db.query(q, [user], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    return res.status(200).send(data);
  })
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~ TRANSAKCJE ~~~~~~~~~~~~~~~~~~~~~~~~~~*/

export const transactions = (req,res) => {
  const user = decrypt(req.body.user);
  const q = "SELECT data_operacji, kwota_operacji FROM bank.operacje WHERE id =  ? ORDER BY id DESC";
  db.query(q, [user], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    return res.status(200).send(data);
  })
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~ WPŁATY ~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

export const payments = (req,res) => {
  const user = decrypt(req.body.user);
  const q = "SELECT sum(kwota_operacji) AS wpłaty FROM bank.operacje WHERE id =  ? AND rodzaj_operacji = 1 ORDER BY id DESC";
  db.query(q, [user], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    return res.status(200).send(data);
  })
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~ WYPŁATY ~~~~~~~~~~~~~~~~~~~~~~~~~~*/

export const payouts = (req,res) => {
  const user = decrypt(req.body.user);
  const q = "SELECT sum(kwota_operacji) AS wypłaty FROM bank.operacje WHERE id =  ? AND rodzaj_operacji = 0 ORDER BY id DESC";
  db.query(q, [user], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    return res.status(200).send(data);
  })
}
