# Sunset Syndicate — Unity MVP (URP + NGO)

Proyecto base para un juego de compra/venta de propiedades original, multijugador online 2–6 jugadores.

## Escenas
- `Assets/Scenes/MainMenu.unity`
- `Assets/Scenes/Lobby.unity`
- `Assets/Scenes/GameBoard.unity`

## Sistemas incluidos (scripts)
- `Core/TurnManager.cs`: flujo de turno con timeout.
- `Core/GameStateMachine.cs`: fases del turno.
- `Board/BoardDefinition.cs`, `Board/TileDefinition.cs`: tablero data-driven.
- `Economy/PropertySystem.cs`: compra, renta, construcción, hipoteca.
- `Cards/CardSystem.cs`: 2 mazos de eventos.
- `Economy/TradeSystem.cs`: propuesta y aceptación doble.
- `Network/NetworkGameManager.cs`: host/join con Unity Netcode + Unity Transport.
- `UI/GameHudController.cs`: botones principales del turno.

## Ejecución local (2 instancias)
1. Abrir Unity 2022.3 LTS o 2023.2 LTS.
2. Instalar paquetes: Netcode for GameObjects, Unity Transport, TextMeshPro, Input System.
3. Cargar `MainMenu` como escena inicial.
4. Ejecutar instancia A como Host.
5. Compilar y abrir instancia B como Client e introducir IP/Join Code (Relay si está configurado).

## Build Windows
1. File → Build Settings → Platform `Windows`.
2. Añadir escenas en orden: MainMenu, Lobby, GameBoard.
3. Scripting Backend IL2CPP recomendado.
4. Build.

## Reconexion y desconexión
- Si cliente se desconecta, `NetworkGameManager` marca jugador como desconectado.
- Timeout configurable: pasado el umbral, IA simple (`BotFallbackController`) toma control.

## Notas de arte (vertical slice)
- Estética miniatura tipo diorama: materiales brillantes, bloom suave, DOF tilt-shift.
- Incluir mínimo: tablero + 6–10 edificios + 6 fichas originales + VFX básicos.
