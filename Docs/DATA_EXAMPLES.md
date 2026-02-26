# Ejemplos concretos de datos

## Ejemplo de casilla (ScriptableObject)
```csharp
index = 21
name = "Distrito Solar"
tileType = Property
districtId = "SOLAR"
purchaseCost = 260
mortgageValue = 130
rentByLevel = [22, 110, 330, 800, 975, 1150]
buildCost = 150
```

## Ejemplo de carta
```csharp
id = "A-07"
text = "Subvención cultural: cobra $120"
effectType = GainMoney
amount = 120
```

## Ejemplo de renta
- Propiedad: `Torre Horizonte` nivel 0 -> renta 24.
- Con distrito completo sin edificios -> 48.
- Con 3 edificios -> 720.

## Ejemplo de trade
- Jugador A ofrece `Paseo Ónix` + $120.
- Jugador B ofrece `Línea Ferry Sur`.
- Ambos confirman: se intercambian tiles y efectivo en una sola transacción atómica.
