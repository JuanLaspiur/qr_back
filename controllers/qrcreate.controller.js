const path = require('path');
const qrCode = require('qrcode');

const get = async (req, res) => {
    try {
        const { event, email } = req.query;

        
        if (!event || !email) { 
            console.log('Event_: '+event);
            console.log('Email_: '+email);
            return res.status(400).send('Los parámetros event y email son obligatorios');
           
        }

       
        const qrText = JSON.stringify({ event, email });

       
        qrCode.toDataURL(qrText, (err, qr) => {
            if (err) {
                console.error('Error al generar el código QR:', err);
                return res.status(500).send('Error en el servidor');
            }

               
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    
                    <title>QR Page</title>
                </head>
                <body>
                    <h1>Mostrá el QR para confirmar tu asistencia</h1>
                    <h2>Ella registrará tu numero de Evento y tu correo para confirmar su asistencia</h2>
                    <img src="${qr}" alt="Código QR">
                </body>
                </html>
            `);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error en el servidor');
    }
};

module.exports = {
    get
};




