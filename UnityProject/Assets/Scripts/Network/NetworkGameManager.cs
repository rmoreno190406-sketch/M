using System.Collections.Generic;
using SunsetSyndicate.Core;
using Unity.Netcode;
using UnityEngine;

namespace SunsetSyndicate.Network
{
    public class NetworkGameManager : NetworkBehaviour
    {
        public static NetworkGameManager Instance { get; private set; }

        [SerializeField] private TurnManager turnManager;
        [SerializeField] private int defaultSeed = 424242;

        private readonly Dictionary<ulong, PlayerState> players = new();

        private void Awake()
        {
            Instance = this;
        }

        public void StartHostGame()
        {
            NetworkManager.Singleton.StartHost();
        }

        public void StartClientGame()
        {
            NetworkManager.Singleton.StartClient();
        }

        public override void OnNetworkSpawn()
        {
            if (!IsServer)
            {
                return;
            }

            NetworkManager.Singleton.OnClientConnectedCallback += HandleClientConnected;
            NetworkManager.Singleton.OnClientDisconnectCallback += HandleClientDisconnected;
        }

        private void HandleClientConnected(ulong clientId)
        {
            if (!players.ContainsKey(clientId))
            {
                players[clientId] = new PlayerState { clientId = clientId, displayName = $"Player {clientId}" };
            }

            TryStartMatch();
        }

        private void HandleClientDisconnected(ulong clientId)
        {
            if (players.TryGetValue(clientId, out var player))
            {
                player.isDisconnected = true;
            }
        }

        private void TryStartMatch()
        {
            if (players.Count < 2)
            {
                return;
            }

            var roster = new List<PlayerState>(players.Values);
            turnManager.Initialize(roster, defaultSeed);
        }
    }
}
