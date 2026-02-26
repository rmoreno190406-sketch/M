using System.Collections.Generic;
using SunsetSyndicate.Board;
using SunsetSyndicate.Core;
using SunsetSyndicate.Data;

namespace SunsetSyndicate.Economy
{
    public class PropertySystem
    {
        private readonly Dictionary<int, ulong> tileOwners = new();
        private readonly Dictionary<int, int> tileLevels = new();
        private readonly HashSet<int> mortgagedTiles = new();

        public bool TryBuyTile(PlayerState player, TileDefinition tile)
        {
            if (tile.tileType != TileType.Property && tile.tileType != TileType.Transport && tile.tileType != TileType.Utility)
            {
                return false;
            }

            if (tileOwners.ContainsKey(tile.index) || player.cash < tile.purchaseCost)
            {
                return false;
            }

            player.cash -= tile.purchaseCost;
            tileOwners[tile.index] = player.clientId;
            player.ownedTileIndices.Add(tile.index);
            return true;
        }

        public int CalculateRent(TileDefinition tile, int rolledValue, int sameTypeOwned)
        {
            if (mortgagedTiles.Contains(tile.index))
            {
                return 0;
            }

            if (tile.tileType == TileType.Transport)
            {
                return sameTypeOwned switch { 2 => 50, 3 => 100, 4 => 200, _ => 25 };
            }

            if (tile.tileType == TileType.Utility)
            {
                return sameTypeOwned >= 2 ? rolledValue * 10 : rolledValue * 4;
            }

            var level = tileLevels.TryGetValue(tile.index, out var lv) ? lv : 0;
            return tile.rentByLevel[level];
        }

        public bool ToggleMortgage(PlayerState player, TileDefinition tile, bool mortgage)
        {
            if (!player.ownedTileIndices.Contains(tile.index))
            {
                return false;
            }

            if (mortgage)
            {
                if (mortgagedTiles.Contains(tile.index)) return false;
                mortgagedTiles.Add(tile.index);
                player.cash += tile.mortgageValue;
                return true;
            }

            if (!mortgagedTiles.Contains(tile.index)) return false;
            var cost = (int)(tile.mortgageValue * 1.1f);
            if (player.cash < cost) return false;
            player.cash -= cost;
            mortgagedTiles.Remove(tile.index);
            return true;
        }
    }
}
