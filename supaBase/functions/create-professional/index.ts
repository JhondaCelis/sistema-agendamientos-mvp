import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { withSupabase } from "jsr:@supabase/server@^1"

interface CreateProfessionalRequest {
  name: string
  email: string
  password: string
  slug: string
}

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    try {
      const {
        name,
        email,
        password,
        slug,
      }: CreateProfessionalRequest = await req.json()

      if (!name || !email || !password || !slug) {
        return Response.json(
          { message: "Todos los campos son obligatorios" },
          { status: 400 },
        )
      }

      if (password.length < 8) {
        return Response.json(
          { message: "La contraseña debe tener mínimo 8 caracteres" },
          { status: 400 },
        )
      }

      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

      if (!slugRegex.test(slug)) {
        return Response.json(
          {
            message:
              "El slug solo puede contener letras minúsculas, números y guiones",
          },
          { status: 400 },
        )
      }

      const { data: adminRecord, error: adminError } = await ctx.supabase
        .from("system_admins")
        .select("id")
        .maybeSingle()

      if (adminError) {
        return Response.json(
          { message: "No fue posible validar el administrador" },
          { status: 500 },
        )
      }

      if (!adminRecord) {
        return Response.json(
          { message: "No autorizado" },
          { status: 403 },
        )
      }

      const { data: authData, error: authError } =
        await ctx.supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        })

      if (authError || !authData.user) {
        return Response.json(
          {
            message:
              authError?.message ?? "No fue posible crear el usuario",
          },
          { status: 400 },
        )
      }

      const { data: professional, error: professionalError } =
        await ctx.supabaseAdmin
          .from("professionals")
          .insert({
            name,
            slug,
            auth_user_id: authData.user.id,
            active: true,
          })
          .select("id, name, slug, active")
          .single()

      if (professionalError) {
        await ctx.supabaseAdmin.auth.admin.deleteUser(authData.user.id)

        return Response.json(
          {
            message:
              "No fue posible crear el profesional",
          },
          { status: 400 },
        )
      }

      return Response.json(
        {
          message: "Profesional creado correctamente",
          professional,
        },
        { status: 201 },
      )
    } catch {
      return Response.json(
        { message: "Error inesperado al crear el profesional" },
        { status: 500 },
      )
    }
  }),
}