namespace SunsetSyndicate.Data
{
    public enum TileType
    {
        Start,
        Property,
        Transport,
        Utility,
        Tax,
        EventA,
        EventB,
        JailVisit,
        GoToJail,
        FreeRest
    }

    public enum TurnPhase
    {
        WaitingRoll,
        Rolling,
        Moving,
        ResolvingTile,
        OptionalActions,
        EndingTurn
    }
}
