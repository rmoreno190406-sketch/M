using System.Collections.Generic;
using SunsetSyndicate.Core;

namespace SunsetSyndicate.Economy
{
    public class TradeOffer
    {
        public ulong fromClient;
        public ulong toClient;
        public int cashFrom;
        public int cashTo;
        public List<int> tilesFrom = new();
        public List<int> tilesTo = new();
        public bool fromConfirmed;
        public bool toConfirmed;
    }

    public class TradeSystem
    {
        public bool TryExecuteTrade(TradeOffer offer, PlayerState from, PlayerState to)
        {
            if (!offer.fromConfirmed || !offer.toConfirmed)
            {
                return false;
            }

            if (from.cash < offer.cashFrom || to.cash < offer.cashTo)
            {
                return false;
            }

            from.cash -= offer.cashFrom;
            to.cash += offer.cashFrom;
            to.cash -= offer.cashTo;
            from.cash += offer.cashTo;

            foreach (var tile in offer.tilesFrom)
            {
                from.ownedTileIndices.Remove(tile);
                to.ownedTileIndices.Add(tile);
            }

            foreach (var tile in offer.tilesTo)
            {
                to.ownedTileIndices.Remove(tile);
                from.ownedTileIndices.Add(tile);
            }

            return true;
        }
    }
}
