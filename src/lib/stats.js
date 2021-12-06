import { isEmptyObj } from "./array";

const didWinBet = ({ match, bet }) => {
  const { playerNumber } = bet;
  const { player1Id, player2Id, winningPlayerId } = match;
  if (!winningPlayerId) return;
  const betOnPlayerId =
    playerNumber === 1 ? player1Id : playerNumber === 2 ? player2Id : null;

  if (!betOnPlayerId) return false;
  return winningPlayerId == betOnPlayerId;
};

const findLargestAmount = (object) => {
  return Object.entries(object).reduce((prev, current) => {
    return prev[1] > current[1] ? prev : current;
  });
};

const findParticipantById = ({ id, participants }) => {
  if (!participants) return;
  return participants.find((participant) => participant.id == id) || {};
};

const getWinningsAndLosses = ({ allMatches, allBets, participants }) => {
  if (!allMatches || !allBets) return;
  let winnings = {};
  let losses = {};
  let largestWin = {};
  let largestLoss = {};

  allBets.forEach((bet) => {
    const foundMatch = allMatches.find((match) => match.id === bet.matchId);
    if (!foundMatch) return;
    const { participantId, volume } = bet;
    if (didWinBet({ match: foundMatch, bet })) {
      const existingVolume = winnings[participantId] || 0;
      winnings[participantId] = existingVolume + volume;
      if ((largestWin.amount || 0) < volume)
        largestWin = {
          ...findParticipantById({ id: participantId, participants }),
          amount: volume,
        };
    } else {
      const existingVolume = losses[participantId] || 0;
      losses[participantId] = existingVolume + volume;
      if ((largestLoss.amount || 0) < volume)
        largestLoss = {
          ...findParticipantById({ id: participantId, participants }),
          amount: volume,
        };
    }
  });

  return { winnings, losses, largestWin, largestLoss };
};

export const getStats = ({ allMatches, allBets, participants }) => {
  const { winnings, losses, largestWin, largestLoss } =
    getWinningsAndLosses({ allMatches, allBets, participants }) || {};

  if (!winnings || !losses || isEmptyObj(winnings) || isEmptyObj(losses))
    return;

  const overallWinnerEntry = findLargestAmount(winnings);
  const overallLoserEntry = findLargestAmount(losses);

  const overallWinner = {
    ...findParticipantById({ id: overallWinnerEntry[0], participants }),
    amount: overallWinnerEntry[1],
  };

  const overallLoser = {
    ...findParticipantById({ id: overallLoserEntry[0], participants }),
    amount: overallLoserEntry[1],
  };

  return { overallWinner, overallLoser, largestWin, largestLoss };
};

export const getPlayerIdFromTag = ({ tag, allPlayers }) => {
  if (!allPlayers || !tag) return;
  const foundPlayer = allPlayers.find(
    ({ tag: _tag }) => _tag.toLowerCase() === tag.toLowerCase()
  );
  return foundPlayer ? foundPlayer.id : undefined;
};

export const getBackingsByPlayerId = ({ allBets, allMatches }) => {
  return allBets.reduce((acc, bet) => {
    const match = allMatches.find((match) => match.id === bet.matchId);
    const concluded = match.winningPlayerId;
    if (concluded) return acc;
    const playerId =
      bet.playerNumber === 1
        ? match.player1Id
        : bet.playerNumber === 2
        ? match.player2Id
        : null;
    return {
      ...acc,
      [playerId]: (acc[playerId] || 0) + bet.volume,
    };
  }, {});
};

export const getBacking = ({ allBets, allMatches, playerId }) => {
  if (!allBets || !allMatches || !playerId) return;
  const allBackings = getBackingsByPlayerId({ allBets, allMatches });
  return allBackings[playerId] || 0;
};
