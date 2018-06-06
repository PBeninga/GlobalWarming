Feature: Movement
   Scenario: Army moves
      Given I have an army of size 50 on a node
      When I send my army to another node
      Then my army will share an xy value with the other node

   Scenario: Army moves back to its original node
      Given I have an army of size 50 on a node
      When I send my army to another node and send it back
      Then my army will share an xy value with the other node
      Then my army will share an xy value with the original node
