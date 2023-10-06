import express from 'express';
import { messageModel } from '../DAO/models/messageModel.js';
const chatRouter = express.Router();

chatRouter.get('/', async (req, res) => {
    try {
        const messages = await messageModel.find(); 
        res.render('chat', { messages }); 
        } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default chatRouter;

