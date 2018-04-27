Feature: Battles
  Scenario: Army Wins
    Given I start with an armies
    When I send my army to a node
    But the node has a smaller army not owned by me
    Then their army gets destroyed
    And my enemy army has less troops
    And the enemy has one less army

  Scenario: Army Dies
    Given I start with an armies
    When I send my army to a node
    But the node has a bigger army not owned by me
    Then my army gets destroyed
    And the enemy army has less troops
    And I have one less army
