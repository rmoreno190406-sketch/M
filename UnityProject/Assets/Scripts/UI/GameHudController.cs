using SunsetSyndicate.Core;
using UnityEngine;

namespace SunsetSyndicate.UI
{
    public class GameHudController : MonoBehaviour
    {
        [SerializeField] private TurnManager turnManager;

        public void OnRollDicePressed()
        {
            Debug.Log("Roll dice requested");
        }

        public void OnEndTurnPressed()
        {
            turnManager.EndTurn();
        }

        public void OnOpenTradePressed()
        {
            Debug.Log("Open trade panel");
        }

        public void OnMortgagePressed()
        {
            Debug.Log("Open mortgage panel");
        }
    }
}
