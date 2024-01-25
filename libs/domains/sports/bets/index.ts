import BetAdapter from "../../../adapters/bet-adapter"

export const logBets = async () => {
  await new BetAdapter().logBets()
}
