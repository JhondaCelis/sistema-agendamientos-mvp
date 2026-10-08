import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function UpdatePasswordPage() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')

    if (password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })

    if (updateError) {
      console.error('Error actualizando contraseña:', updateError)
      setLoading(false)
      setError(updateError.message)
      return
    }

    await supabase.auth.signOut()

    setLoading(false)
    navigate('/login')
  }

  return (
    <main>
      <h1>Nueva contraseña</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">Nueva contraseña</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">
            Confirmar contraseña
          </label>

          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Actualizando...' : 'Cambiar contraseña'}
        </button>
      </form>
    </main>
  )
}

export default UpdatePasswordPage