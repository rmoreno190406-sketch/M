using System;
using System.Collections.Generic;
using SunsetSyndicate.Data;
using UnityEngine;

namespace SunsetSyndicate.Core
{
    public class TurnManager : MonoBehaviour
    {
        [SerializeField] private float turnTimeoutSeconds = 75f;

        public event Action<ulong> OnTurnStarted;
        public event Action<ulong> OnTurnEnded;

        private readonly List<PlayerState> turnOrder = new();
        private readonly GameStateMachine stateMachine = new();
        private int currentTurnIndex;
        private float timer;

        public PlayerState CurrentPlayer => turnOrder.Count == 0 ? null : turnOrder[currentTurnIndex];
        public TurnPhase CurrentPhase => stateMachine.CurrentPhase;

        public void Initialize(List<PlayerState> players, int seed)
        {
            turnOrder.Clear();
            turnOrder.AddRange(players);
            Shuffle(turnOrder, seed);
            currentTurnIndex = 0;
            StartTurn();
        }

        private void Update()
        {
            if (turnOrder.Count == 0)
            {
                return;
            }

            timer -= Time.deltaTime;
            if (timer <= 0f)
            {
                ForceEndTurn();
            }
        }

        public void StartTurn()
        {
            timer = turnTimeoutSeconds;
            stateMachine.SetPhase(TurnPhase.WaitingRoll);
            OnTurnStarted?.Invoke(CurrentPlayer.clientId);
        }

        public void EndTurn()
        {
            OnTurnEnded?.Invoke(CurrentPlayer.clientId);
            currentTurnIndex = (currentTurnIndex + 1) % turnOrder.Count;
            StartTurn();
        }

        public void ForceEndTurn()
        {
            stateMachine.SetPhase(TurnPhase.EndingTurn);
            EndTurn();
        }

        private static void Shuffle<T>(IList<T> list, int seed)
        {
            var random = new System.Random(seed);
            for (var i = list.Count - 1; i > 0; i--)
            {
                var j = random.Next(i + 1);
                (list[i], list[j]) = (list[j], list[i]);
            }
        }
    }
}
