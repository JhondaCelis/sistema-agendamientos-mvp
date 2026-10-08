import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setMessage('')
    setError('')
    setLoading(true)

    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })

    setLoading(false)

    if (resetError) {
      setError('No fue posible enviar el correo de recuperación')
      return
    }

    setMessage(
      'Si el correo está registrado, recibirás un enlace para cambiar la contraseña.',
    )
  }

  return (
    <main>
      <h1>Recuperar contraseña</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Correo</label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        {error && <p>{error}</p>}
        {message && <p>{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar enlace'}
        </button>
      </form>

      <p>
        <Link to="/login">Volver al login</Link>
      </p>
    </main>
  )
}

export default ForgotPasswordPage