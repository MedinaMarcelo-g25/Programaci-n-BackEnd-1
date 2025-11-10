function resetPasswordTemplate(name, resetLink){
  return `
    <div style="font-family:Arial,sans-serif;color:#111">
      <h2>Restablecer contraseña</h2>
      <p>Hola ${name || ''},</p>
      <p>Solicitaste restablecer tu contraseña. Haz click en el botón para continuar. El enlace expirará en 1 hora.</p>
      <a href="${resetLink}" style="display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;">Restablecer contraseña</a>
      <p>Si no solicitaste este cambio, ignora este email.</p>
    </div>
  `;
}
module.exports = { resetPasswordTemplate };