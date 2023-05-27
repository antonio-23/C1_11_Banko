import express from 'express';
import { authorize_klient, authorize_pracownik } from '../../middleware/authorize';

const router = express.Router();

router.post("/authorize_k", authorize_klient);
router.post("/authorize_p", authorize_pracownik);

export default router;
