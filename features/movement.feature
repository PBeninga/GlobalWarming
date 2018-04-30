Feature: Movement
  Scenario: Army moves
    Given I have an army of size 50 on a node
    When I send my army to another node
    Then my army will be on the other node
