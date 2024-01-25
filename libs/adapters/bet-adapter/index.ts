import LadbrokesClient from 'ladbrokes-client';
import { putItem } from 'dynamodb-client';
import { Bet } from "./src/types/bet";

export default class BetAdapter {
  constructor() {
  }

  async logBets() {
    const pendingBetDetails = await new LadbrokesClient().getPendingBetsDetail()

    Promise.all(
      pendingBetDetails.map(async bet => {
        const betRecord: Bet = {
          Id: bet.id,
          EventId: bet.event.id,
          Player1: bet.event.player1,
          Player2: bet.event.player2,
          Player1Odd: bet.event.player1Odd,
          Player2Odd: bet.event.player2Odd,
          Tournament: bet.event.tournament,
        }

        await putItem('Bets', betRecord)
      })
    )
  }
}