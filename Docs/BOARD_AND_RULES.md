# Sunset Syndicate (MVP) — Tablero y Reglas

## Paso 1: Diseño del tablero original (40 casillas)
Ciudad ficticia: **Sunset Bay**.

| # | Nombre | Tipo |
|---|---|---|
| 0 | Puerto de Salida | Inicio |
| 1 | Paseo Coral | Propiedad (Distrito Coral) |
| 2 | Archivo Cívico | Evento A (Crónicas Urbanas) |
| 3 | Avenida Nácar | Propiedad (Distrito Coral) |
| 4 | Tasa de Infraestructura | Impuesto |
| 5 | Línea Ferry Norte | Transporte |
| 6 | Calle Brisa | Propiedad (Distrito Brisa) |
| 7 | Plaza de Rumores | Evento B (Pulso de la Ciudad) |
| 8 | Jardín de Marea | Propiedad (Distrito Brisa) |
| 9 | Mirador Salino | Propiedad (Distrito Brisa) |
| 10 | Sala de Retención | Visita / Cárcel equivalente |
| 11 | Bulevar Cobre | Propiedad (Distrito Cobre) |
| 12 | Central Hídrica Delta | Servicio |
| 13 | Pasaje Ámbar | Propiedad (Distrito Cobre) |
| 14 | Terraza Fundición | Propiedad (Distrito Cobre) |
| 15 | Terminal Tranvía Este | Transporte |
| 16 | Costanera Lila | Propiedad (Distrito Lila) |
| 17 | Archivo Cívico | Evento A |
| 18 | Patio Jacaranda | Propiedad (Distrito Lila) |
| 19 | Paseo Neblina | Propiedad (Distrito Lila) |
| 20 | Parque de Descanso | Neutral |
| 21 | Distrito Solar | Propiedad (Distrito Solar) |
| 22 | Plaza de Rumores | Evento B |
| 23 | Alameda Prisma | Propiedad (Distrito Solar) |
| 24 | Torre Horizonte | Propiedad (Distrito Solar) |
| 25 | Línea Ferry Sur | Transporte |
| 26 | Puerto Índigo | Propiedad (Distrito Índigo) |
| 27 | Rambla Acero | Propiedad (Distrito Índigo) |
| 28 | Red Eléctrica Boreal | Servicio |
| 29 | Paseo Titanio | Propiedad (Distrito Índigo) |
| 30 | Orden de Arresto | Ir a Retención |
| 31 | Jardines Rubí | Propiedad (Distrito Rubí) |
| 32 | Centro Vecinal | Propiedad (Distrito Rubí) |
| 33 | Archivo Cívico | Evento A |
| 34 | Plaza Granate | Propiedad (Distrito Rubí) |
| 35 | Terminal Tranvía Oeste | Transporte |
| 36 | Pulso de la Ciudad | Evento B |
| 37 | Paseo Ónix | Propiedad (Distrito Ónix) |
| 38 | Tasa de Lujo | Impuesto |
| 39 | Mirador Corona | Propiedad (Distrito Ónix) |

## Paso 2: Reglas exactas (MVP)

### Configuración base
- Jugadores: 2–6.
- Dinero inicial: **$1800** por jugador.
- Cobro al pasar por Puerto de Salida: **$240**.
- Timeout de turno por defecto: **75 s**.
- Orden de turno: aleatorio por seed del host.

### Dados y movimiento
- 2d6.
- Doble: turno extra (máx 2 dobles seguidos, al 3ro vas a Sala de Retención).
- Movimiento casilla a casilla con animación.

### Compra / subasta
- Si una propiedad libre es aterrizada:
  - Opción de comprar al precio listado.
  - Si declina o no puede pagar, se inicia subasta global (mínimo 60% del valor base, incrementos de $10).

### Distritos y construcción
- Distritos de 2 o 3 propiedades.
- Solo construyes si posees todo el distrito y ninguna propiedad del set está hipotecada.
- Construcción uniforme por set (diferencia máxima de 1 nivel entre propiedades del distrito).
- Niveles: 0 (sin edificio), 1–4 (edificios), 5 (Torre).

### Alquileres (fórmula)
- Alquiler base (nivel 0): definido por tabla de propiedad (aprox 8–50).
- Con set completo sin edificios: x2 base.
- Niveles 1–4: renta por tabla de propiedad.
- Nivel 5 Torre: renta máxima por tabla.
- Transporte: 25 / 50 / 100 / 200 según cantidad poseída.
- Servicio: 4x dado si tiene 1, 10x dado si tiene 2.

### Costes de edificios
- Distritos tempranos: $60 por nivel.
- Distritos medios: $110 por nivel.
- Distritos altos: $170 por nivel.
- Distritos premium: $230 por nivel.

### Hipoteca
- Hipotecar: recibes 50% del valor base.
- Deshipotecar: pagas 55% del valor base (50% + 10% de interés redondeado).
- Propiedad hipotecada no cobra renta.

### Impuestos
- Tasa de Infraestructura: paga $180.
- Tasa de Lujo: paga $120.

### Sala de Retención (cárcel equivalente)
- Formas de entrar: caer en “Orden de Arresto”, triple doble, carta.
- Salida:
  1) pagar $80 al inicio de turno,
  2) usar “Pase Libre de Retención”,
  3) sacar doble en hasta 3 intentos.
- Si falla 3 intentos, paga $80 y sale automáticamente.

### Cartas (2 mazos de 20)
- **Crónicas Urbanas (Evento A):** efectos de gobierno/ciudad.
- **Pulso de la Ciudad (Evento B):** eventos sociales/mercado.
- Tipos: cobrar/pagar banco, pagar/cobrar a todos, mover a casilla, mover relativo, reparaciones por edificios, pase libre de retención.

### Comercio
- Solo fuera de resolución obligatoria (después de movimiento/evento).
- Puede intercambiar: propiedades, dinero, carta “Pase Libre”.
- Doble confirmación: ofertante confirma, receptor confirma.

### Bancarrota
1) Jugador intenta pagar deuda.
2) Puede vender edificios (mitad del coste), hipotecar, negociar.
3) Si sigue insolvente:
   - Si deuda a jugador: transfiere propiedades no hipotecadas + efectivo restante al acreedor.
   - Si deuda a banco: propiedades vuelven a subasta.
4) Jugador eliminado; partida continúa.

### Condición de victoria
- Último jugador no quebrado gana.
- Variante opcional: límite de rondas y gana mayor patrimonio neto.
