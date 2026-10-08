import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setLoading(true)

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setLoading(false)
      setError('Correo o contraseña incorrectos')
      return
    }

    const {
      data: adminRecord,
      error: adminError,
    } = await supabase
      .from('system_admins')
      .select('id')
      .maybeSingle()

    if (adminError) {
      setLoading(false)
      setError('No fue posible validar el usuario')
      return
    }

    if (adminRecord) {
      setLoading(false)
      navigate('/admin-system')
      return
    }

    const {
      data: professionalRecord,
      error: professionalError,
    } = await supabase
      .from('professionals')
      .select('id')
      .maybeSingle()

    if (professionalError) {
      setLoading(false)
      setError('No fue posible validar el profesional')
      return
    }

    if (professionalRecord) {
      setLoading(false)
      navigate('/admin')
      return
    }

    await supabase.auth.signOut()

    setLoading(false)
    setError('El usuario no tiene acceso al sistema')
  }

  return (
    <main>
      <h1>Ingreso</h1>

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

        <div>
          <label htmlFor="password">Contraseña</label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p>
        <Link to="/forgot-password">
          Olvidé mi contraseña
        </Link>
      </p>
    </main>
  )
}

export default LoginPage