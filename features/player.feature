Feature: Players
   Scenario: Player joins the game
      Given A player pool
      When A player opens the game
      Then the player is added to the pool

   Scenario: Player leaves the game
      Given A player pool and a player
      When the player leaves the game
      Then the player is set to inactive
