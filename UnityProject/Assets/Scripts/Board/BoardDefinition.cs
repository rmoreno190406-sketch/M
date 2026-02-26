using System.Collections.Generic;
using UnityEngine;

namespace SunsetSyndicate.Board
{
    [CreateAssetMenu(menuName = "SunsetSyndicate/BoardDefinition")]
    public class BoardDefinition : ScriptableObject
    {
        public List<TileDefinition> tiles = new();

        public TileDefinition GetTile(int index)
        {
            if (tiles.Count == 0)
            {
                return null;
            }

            var wrapped = ((index % tiles.Count) + tiles.Count) % tiles.Count;
            return tiles[wrapped];
        }
    }
}
