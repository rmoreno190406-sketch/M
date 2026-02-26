using System;
using System.Collections.Generic;
using SunsetSyndicate.Core;

namespace SunsetSyndicate.Cards
{
    public enum CardDeckType { EventA, EventB }
    public enum CardEffectType { GainMoney, LoseMoney, MoveToIndex, MoveRelative, PayAllPlayers, ReceiveFromAllPlayers, GetOutOfJail }

    [Serializable]
    public class CardDefinition
    {
        public string id;
        public string text;
        public CardEffectType effectType;
        public int amount;
        public int targetIndex;
    }

    public class CardSystem
    {
        private readonly Queue<CardDefinition> eventA = new();
        private readonly Queue<CardDefinition> eventB = new();

        public void Initialize(IEnumerable<CardDefinition> deckA, IEnumerable<CardDefinition> deckB)
        {
            FillQueue(eventA, deckA);
            FillQueue(eventB, deckB);
        }

        public CardDefinition Draw(CardDeckType deckType)
        {
            var deck = deckType == CardDeckType.EventA ? eventA : eventB;
            var card = deck.Dequeue();
            deck.Enqueue(card);
            return card;
        }

        public void Apply(CardDefinition card, PlayerState activePlayer, IReadOnlyList<PlayerState> players)
        {
            switch (card.effectType)
            {
                case CardEffectType.GainMoney:
                    activePlayer.cash += card.amount;
                    break;
                case CardEffectType.LoseMoney:
                    activePlayer.cash -= card.amount;
                    break;
                case CardEffectType.PayAllPlayers:
                    foreach (var p in players)
                    {
                        if (p.clientId == activePlayer.clientId || p.isBankrupt) continue;
                        activePlayer.cash -= card.amount;
                        p.cash += card.amount;
                    }
                    break;
                case CardEffectType.ReceiveFromAllPlayers:
                    foreach (var p in players)
                    {
                        if (p.clientId == activePlayer.clientId || p.isBankrupt) continue;
                        p.cash -= card.amount;
                        activePlayer.cash += card.amount;
                    }
                    break;
            }
        }

        private static void FillQueue(Queue<CardDefinition> queue, IEnumerable<CardDefinition> cards)
        {
            queue.Clear();
            foreach (var card in cards)
            {
                queue.Enqueue(card);
            }
        }
    }
}
