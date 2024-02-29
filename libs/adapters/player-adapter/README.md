# PLAYER ADAPTER

get player data from tennislive-client then save it to dynamodb to be used later

## dependencies

## general consideration

DO NOT use matrix for 1/2, fin :
  - tennis semifinal, final
  - esports upper vs lower
Lost $30 already. The possibility wrong odd is > 50%


## Tennis consideration

These are the list on odds for Tennis
- General
  - compare :
    - age
    - ranking
        - DISREGARD ranking below 100 diff
    - win percentage
    - last 20 W / L record
  - Red Flag :
    -  lost against younger player with lower ranking in the last 20 games and will play against younger player with no ranking.
    - lower rank double team might win when :
      - met before on the same competition
    - avoid game when the fav just on the final tournament. LOST $9.90
        - this is above everything : ranking diff, beatenByLowerRankingThanOpponent,lostToLowerRanking
        - example: alex de minaur, aryna sabalenka
    - H2H longest streak :
      - ATP :
        - 2 - 50%%
        - 4 - 50%
      - WTA :
        - 3 - 100%
    - WL10
      - fav win only 20% in L10 will be beaten by lower ranking ( 73 diff ) 40% in L10. LOST $5
    - no 1 more fragile. When opponent already beat top 10 before in the competition probably will beat no 1 too


- WTA
  - when player 28 years and older then high risk against below 25 years although has higher ranking
  - DO NOT put big bet on player below 20 years old even the odd good and all matrix good. LOST $7

- careful 50% wrong odds :
  - historically player lost at least 2x to player with lower / no ranking in the last 10 lost. LOST $10
    - lost 1 to lower / no ranking player

- DO NOT CASH OUT - LOST $3
  - score could be bad early: 1-6, 6-3, 6-0

## Tennis how to compare player with previous match

- find the lowest rank, lowest age gap, lowest win percentage gap
- compare it to the current match player

## esports consideration

- lower rank team might win when :
  - met before on the same competition (lower bracket vs upper bracket)
  - GG ELO rating of the higher ranking team is downhill
