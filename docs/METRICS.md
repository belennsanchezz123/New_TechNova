# Documentacion de Metricas — TechNova

Todas las metricas se guardan en la base de datos SQLite bajo la tabla `session_metrics` como pares clave-valor, y se consolidan en la tabla `participant_metrics`.

## Convencion de valores

| Tipo | Descripcion |
|------|-------------|
| `null` | No aplica o el participante no llego a ese punto |
| `0` / `1` | Booleano: 0 = no, 1 = si |
| `INTEGER > 1` | Conteo o valor numerico |
| `TEXT` | Valor categorico o cadena |
| `TEXT(JSON)` | Objeto o array serializado como JSON |
| `REAL` | Numero decimal |

---

## Escenario 0 — Politicas de Uso

| Metrica | Tipo | Descripcion |
|---------|------|-------------|
| `scenario0.policy_acceptance_time_seconds` | INT | Segundos que tardo en aceptar las politicas de uso |

---

## Escenario 1 — Cuentas y Seguridad

| Metrica | Tipo | Descripcion |
|---------|------|-------------|
| `scenario1.time_seconds` | INT | Tiempo total en el escenario (segundos) |
| `scenario1.wifi_public` | 0/1 | 1 = conecto a red publica, 0 = red corporativa |
| `scenario1.mail_password_strength` | TEXT | Fortaleza de la contrasena del correo: `Weak` / `Medium` / `Strong` |
| `scenario1.drive_password_strength` | TEXT | Fortaleza de la contrasena de Drive |
| `scenario1.events_password_strength` | TEXT | Fortaleza de la contrasena del calendario |
| `scenario1.default_password_flag` | 0/1 | 1 = acepto la contrasena preestablecida del correo |
| `scenario1.password_reused` | REAL | Similitud promedio entre pares de contrasenas (0.0–1.0) |
| `scenario1.mfa_usage` | 0/1 | 1 = activo MFA en al menos un servicio |
| `scenario1.mfa_method_primary` | TEXT | Metodo MFA principal: `SMS` / `App` / `Email` / `None` |
| `scenario1.mfa_method_backup` | TEXT | Metodo MFA de respaldo |
| `scenario1.mfa_email_alternative` | 0/1 | 1 = configuro email alternativo de recuperacion |
| `scenario1.teams_camera_permission` | 0/1 | 1 = concedio permiso de camara en Teams |
| `scenario1.teams_microphone_permission` | 0/1 | 1 = concedio permiso de microfono en Teams |

---

## Escenario 2 — Interrupciones y Elementos Externos

| Metrica | Tipo | Descripcion |
|---------|------|-------------|
| `scenario2.time_seconds` | INT | Tiempo total en el escenario (segundos) |
| `scenario2.manual_lock_screen` | 0/1 | 1 = bloqueo la pantalla manualmente antes de alejarse |

---

## Escenario 3 — Email y Comunicaciones

| Metrica | Tipo | Descripcion |
|---------|------|-------------|
| `scenario3.time_seconds` | INT | Tiempo total en el escenario (segundos) |
| `scenario3.phishing_clicked` | REAL | Proporcion de correos de phishing clicados (0.0–1.0) |
| `scenario3.phishing_reported` | REAL | Proporcion de correos de phishing reportados correctamente (0.0–1.0) |
| `scenario3.phishing_false_positives` | INT | Numero de correos legitimos reportados como phishing |
| `scenario3.phishing_report_reasons` | TEXT(JSON) | Razones de reporte por correo: `{"mensaje2":"...", "mensaje6":"..."}` |
| `scenario3.credential_exposure` | INT | Numero de veces que introdujo credenciales en paginas falsas (0, 1 o 2) |
| `scenario3.real_password_exposed` | 0/1 | 1 = la contrasena introducida en phishing coincide con alguna contrasena corporativa real creada en escenario 1 |
| `scenario3.secure_data_transmission` | 0/1 | 1 = uso cifrado al enviar datos sensibles |

### Correos del escenario 3

| ID | Remitente | Tipo | Descripcion |
|----|-----------|------|-------------|
| 1 | Laura Perez (Gerente) | Legitimo | Bienvenida al equipo |
| 2 | Soporte Tecnico TechNova | Phishing-creds | Verificacion de credenciales urgente |
| 3 | Equipo IT TechNova | Legitimo | Aviso renovacion MFA |
| 4 | Comite Social TechNova | Legitimo | Invitacion Team Building |
| 5 | RRHH TechNova Pagos | Phishing-creds | Bono de 1.200€ bloqueado — pide datos bancarios |
| 6 | Seguridad Microsoft 365 | Phishing-creds | Sesion de Outlook expirada |
| 7 | Great Place To Work | Phishing-creds | Encuesta de clima laboral con verificacion de credenciales antes de acceder |
| 8 | Laura Perez (Gerente) | Legitimo | Solicitud de documento |

---

## Escenario 4 — Navegacion Web

| Metrica | Tipo | Descripcion |
|---------|------|-------------|
| `scenario4.time_seconds` | INT | Tiempo total en el escenario (segundos) |
| `scenario4.response_to_browser_warnings` | TEXT | `Ignored` / `Heeded` / `Not Encountered` |
| `scenario4.cookie_consent` | TEXT | `Accepted All` / `Rejected` / `Customized` |
| `scenario4.clicked_dangerous_link` | 0/1 | 1 = clico en enlace peligroso |
| `scenario4.extensions_disabled_pct` | REAL | % de extensiones sospechosas desactivadas (0–100) |
| `scenario4.warnings_heeded_pct` | REAL | % de avisos de seguridad atendidos (0–100) |
| `scenario4.cookie_accepted_pct` | REAL | % de banners donde acepto todas las cookies (0–100) |
| `scenario4.cookie_consent_by_site` | TEXT(JSON) | Decision por sitio: `{"official":"reject","suspicious":"accept",...}` |
| `scenario4.cookie_risk_score` | REAL | Score de riesgo de consentimiento de cookies (0–100) |
| `scenario4.dangerous_links_clicked_pct` | REAL | % de enlaces peligrosos clicados (0–100) |

---

## Escenario 5 — Uso del Asistente IA para RRHH

El escenario simula un chat de RRHH con un asistente IA. El participante recibe un chat con informacion de empleados (nombres, DNIs ficticios, salarios) y debe redactar un informe de validacion Q4.

**Mecanismo de trampa**: Si el participante pasa datos de empleados a la IA, se inyecta un salario incorrecto para Lucia Marquez (200.000€ en lugar de 48.000€) para medir pensamiento critico.

| Metrica | Tipo | Descripcion |
|---------|------|-------------|
| `scenario5.time_seconds` | INT | Tiempo total en el escenario (segundos) |
| `scenario5.ai_used` | TEXT | `Yes` / `No` — si uso el boton del asistente IA |
| `scenario5.ai_trap_injected` | TEXT | `Yes` / `No` — si se activo la trampa de salario |

### Almacenamiento de métricas de IA

Las métricas simples de sesión de este escenario se guardan en `session_metrics` (con claves `scenario5.*`).

Las métricas detalladas del flujo de IA se guardan en la tabla `ai_interactions` del backend, no en `session_metrics`. Esto permite mantener:

- la privacidad del participante,
- solo métricas derivadas sin almacenar prompts o respuestas de texto completas,
- un registro dedicado de cada interacción de IA por sesión.

Las métricas derivadas de `ai_interactions` incluyen:

- `user_prompt_length` — longitud del prompt del usuario en caracteres
- `user_prompt_word_count` — número de palabras del prompt
- `ai_response_source` — `openai` o `fallback`
- `trap_injected` — 1 si se activó la trampa salarial, 0 si no
- `user_edited_after_ai` — 1 si el participante editó el texto generado por IA
- `text_preservation_ratio` — similitud entre la respuesta de la IA y el texto final
- `trap_detected` — 1 si el texto final contiene el valor trampa
- `mentioned_need_verification` — 1 si el participante pidió validar/comprobar
- `user_final_has_pii` — 1 si el texto final contiene datos personales detectados
- `ai_reaction_time_seconds` — segundos entre la respuesta de IA y el envío final

### Cuando se activa la trampa

La trampa se activa si el prompt contiene nombres de empleados del chat, el símbolo `€`, o palabras clave como `resumen` o `consolida`. Si el participante escribe un prompt genérico sin datos, la IA devuelve una plantilla vacía.

---

## Escenario 6 — Configuracion del Perfil Profesional

| Metrica | Tipo | Descripcion |
|---------|------|-------------|
| `scenario6.time_seconds` | INT | Tiempo total en el escenario (segundos) |
| `scenario6.personal_data_disclosure_rate` | TEXT | Campos sensibles revelados: `"4/6 Revelados: [Fecha de Nacimiento, Telefono Personal, ...]"` o `"0 (Minimizacion de datos correcta)"` |
| `scenario6.third_party_app_authorization` | TEXT | `Accepted excessive permissions` / `Denied excessive permissions` |

### Campos considerados sensibles en el perfil

1. Fecha de Nacimiento — riesgo de ingenieria social
2. Telefono Personal — riesgo de smishing
3. Ciudad de Residencia — riesgo de ubicacion fisica
4. Redes Sociales Externas — riesgo de perfilado externo
5. Email Personal — riesgo de phishing/suplantacion
6. Ubicacion en tiempo real — riesgo de exposicion de ubicacion

---

## Escenario 7 — Limpieza y Gestion de Archivos

| Metrica | Tipo | Descripcion |
|---------|------|-------------|
| `scenario7.time_seconds` | INT | Tiempo total en el escenario (segundos) |
| `scenario7.document_deleted` | 0/1 | 1 = elimino documento sensible de Descargas |
| `scenario7.recycle_bin_emptied` | 0/1 | 1 = vacio la papelera de reciclaje |

---

## Escenario 9 — Realizacion del Cuestionario

| Metrica | Tipo | Descripcion |
|---------|------|-------------|
| `scenario9.time_seconds` | INT | Tiempo total en el escenario (segundos, minimo 240) |

---

## Evento Inesperado — Actualizacion del Sistema

Notificacion de Windows Update falsa que aparece durante la simulacion. Opciones: Reiniciar ahora, Posponer (5/10/15 min), Ignorar.

| Metrica | Tipo | Descripcion |
|---------|------|-------------|
| `taskbar.update_notification_appeared` | TEXT | `Yes` si aparecio la notificacion |
| `taskbar.update_notification_timestamp` | TEXT | Hora local española en que aparecio la notificacion |
| `taskbar.update_user_action` | TEXT | Ultima accion: `Restart` / `Postpone_5m` / `Postpone_10m` / `Postpone_15m` / `Dismissed` / `Ignored` |
| `taskbar.update_response_time_seconds` | INT | Segundos hasta que el participante reacciono |
| `taskbar.update_postpone_count` | INT | Numero total de veces que pospuso |
| `taskbar.update_postpone_delay_minutes` | INT | Minutos elegidos en el ultimo posponer |
| `taskbar.update_postpone_history` | TEXT(JSON) | Historial completo: `[{"time": "16/4/2026, 19:18:01", "delayMinutes": 5}, ...]` |

---

## Metricas de Simulacion General

| Metrica | Tipo | Descripcion |
|---------|------|-------------|
| `simulation.total_time_seconds` | INT | Tiempo total de la simulacion completa (segundos) |

---

## Notas sobre la base de datos

- Las metricas se guardan en tiempo real a medida que el participante avanza
- La tabla `ai_interactions` almacena cada interaccion con el asistente IA por separado, incluyendo prompt, respuesta, valor trampa y texto final del informe
- Las contrasenas creadas en el escenario 1 se guardan en `sessionStorage` del navegador para poder comparar con las introducidas en correos de phishing (nunca se envian al servidor)
