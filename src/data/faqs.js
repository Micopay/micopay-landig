/* MicoPay — fuente única del FAQ.

   Este array lo consumen dos lugares:
     1. `components/Faq.jsx`      → lo que ve la persona en la página.
     2. `pages/index.astro`       → el JSON-LD de FAQPage que lee Google.

   Antes estaba copiado a mano en ambos, con un comentario pidiendo que
   coincidieran palabra por palabra. Coincidían, pero era cuestión de tiempo:
   marcar en JSON-LD una respuesta distinta a la visible es motivo de
   penalización por parte de Google. Editando aquí, los dos quedan al día.

   Formato: [pregunta, respuesta]. */
export const FAQS = [
  ['¿Por qué MicoPay?', 'Por el micelio: la red de hilos con la que los hongos se conectan bajo tierra y reparten nutrientes entre árboles que nunca se tocan. No hay un centro que mande, y aun así funciona. MicoPay se organiza igual — una red de personas y negocios de tu colonia moviendo efectivo de mano en mano, sin un banco en medio. Cada proveedor es un nodo, y el escrow en Stellar es lo que sostiene la confianza entre desconocidos.'],
  ['¿Cómo funciona el escrow?', 'Al iniciar la operación tus USDC quedan bloqueados en un contrato inteligente. El proveedor solo los cobra cuando confirmas que recibiste tu efectivo. Si no se concreta, el reembolso es automático y completo.'],
  ['¿Cuánto me cuesta?', 'No hay una tarifa única: cada proveedor pone la suya, normalmente entre 1.9% y 2.5%, más una comisión de plataforma pequeña. Antes de aceptar ves el monto exacto en pesos que vas a recibir, ya con todo descontado — nunca hay cobros después.'],
  ['¿Necesito cuenta bancaria?', 'No. MicoPay está diseñado para quien no tiene acceso bancario: solo necesitas una billetera, y la app te ayuda a crearla en un minuto.'],
  ['¿Qué pasa si el proveedor no aparece?', 'Cancelas desde la app y tus USDC regresan íntegros. El incidente afecta la reputación en cadena del proveedor, que es pública.'],
  ['¿Sirve para recibir remesas?', 'Sí. Quien te envía manda USDC desde cualquier país y tú retiras pesos en efectivo cerca de casa, sin las comisiones de las casas de cambio tradicionales.'],
  ['¿Cuándo abre en mi ciudad?', 'Estamos activando ciudad por ciudad según el interés registrado. Déjanos tu correo abajo y te avisamos apenas abra la tuya.'],
];
