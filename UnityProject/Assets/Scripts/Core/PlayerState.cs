using System.Collections.Generic;

namespace SunsetSyndicate.Core
{
    public class PlayerState
    {
        public ulong clientId;
        public string displayName;
        public int cash = 1800;
        public int boardIndex;
        public bool isInJail;
        public int jailTurns;
        public bool isBankrupt;
        public bool isDisconnected;
        public readonly HashSet<int> ownedTileIndices = new();
    }
}
