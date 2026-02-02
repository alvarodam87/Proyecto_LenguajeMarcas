const sharp = require('sharp');
const fs = require('fs');

const icons = [
  { src: 'img/pay_visa.svg', dest: 'img/pay_visa.jpg' },
  { src: 'img/pay_mastercard.svg', dest: 'img/pay_mastercard.jpg' },
  { src: 'img/pay_paypal.svg', dest: 'img/pay_paypal.jpg' }
];

(async () => {
  for (const ic of icons) {
    if (!fs.existsSync(ic.src)) {
      console.error('No existe:', ic.src);
      continue;
    }
    try {
      await sharp(ic.src)
        .flatten({ background: { r: 255, g: 255, b: 255 } }) // fondo blanco
        .jpeg({ quality: 85 })
        .toFile(ic.dest);
      console.log('Convertido:', ic.src, '->', ic.dest);
    } catch (err) {
      console.error('Error al convertir', ic.src, err);
    }
  }
})();
