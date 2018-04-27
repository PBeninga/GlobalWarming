Feature: Movement
  Scenario: Army moves
    Given I have an army on a node
    When I send my army to another node
    Then the army will move to the new node
