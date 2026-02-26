using SunsetSyndicate.Data;
using UnityEngine;

namespace SunsetSyndicate.Board
{
    [CreateAssetMenu(menuName = "SunsetSyndicate/Tile")]
    public class TileDefinition : ScriptableObject
    {
        public int index;
        public string displayName;
        public TileType tileType;
        public string districtId;
        public int purchaseCost;
        public int mortgageValue;
        public int[] rentByLevel = new int[6];
        public int buildCost;
        public int taxAmount;
    }
}
