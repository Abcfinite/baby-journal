# LADBROKES-CLIENT

## authorization

bearer token on Authorization header

## collections

There are several API call in ladbroke that can be used:
    - pending : https://socket.ladbrokes.com.au/rest/v1/transactions
        - bet_status_ids : ["6d91cb72-215e-47d1-93d0-e2105db3165c"]
        - transaction_type_ids : ["3a71227e-727c-4180-984d-87bf92f0f456"]
    - events : https://api.ladbrokes.com.au/v2/sport/event-request
    - event detail : https://api.ladbrokes.com.au/v2/sport/event-card?id=556c91e7-15e6-4193-a5f4-e1c14b877792
    - result : https://socket.ladbrokes.com.au/rest/v1/transactions
        - bet_status_ids : ["29d8c93c-3115-41ac-a2a0-ba2167f4b7a5","4ee5b54-1b36-4333-bcb7-f5bacd7ac655"]
        - transaction_types_ids : ["63903548-09a6-405c-9277-aee297cebed2","3a71227e-727c-4180-984d-87bf92f0f456"]

## relations between API response

paths that need to be followed
    - get event id based on pending : pending.sports_events.id --> query.events.id
        example: 1c082e54-8052-43d8-b446-31c4b865de7c
    - get odds from event id : query.events.main_markets.entrant_ids --> prices.odds
        example main_markets : d44e17e6-aba0-4dfe-9997-215831d25745
        recorded odd : numerator / denominator + 1

## errors

without token :
{"status":403,"data":null,"message":"invalid session"}