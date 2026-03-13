import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (email, username) => {
  try {
    const result = await resend.emails.send({
      from: 'Instituto Foro <onboarding@resend.dev>',
      to: email,
      subject: '¡Bienvenido al Instituto Foro!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #1a1a1a; color: #e0e0e0; padding: 30px; border-radius: 10px;">
          <h1 style="color: #6a0dad;">¡Bienvenido, ${username}!</h1>
          <p>Tu cuenta fue creada exitosamente en el <strong>Instituto Foro</strong>.</p>
          <p>Ya podés explorar los temas, crear hilos y participar en las discusiones.</p>
          <p style="color: #888; font-size: 0.85rem; margin-top: 30px;">Si no creaste esta cuenta, ignorá este mensaje.</p>
        </div>
      `
    });
    console.log('Email enviado:', result);
  } catch (error) {
    console.error('Error completo email:', error);
  }
};