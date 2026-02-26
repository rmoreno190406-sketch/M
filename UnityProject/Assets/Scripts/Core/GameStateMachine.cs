using SunsetSyndicate.Data;

namespace SunsetSyndicate.Core
{
    public class GameStateMachine
    {
        public TurnPhase CurrentPhase { get; private set; } = TurnPhase.WaitingRoll;

        public void SetPhase(TurnPhase phase)
        {
            CurrentPhase = phase;
        }
    }
}
