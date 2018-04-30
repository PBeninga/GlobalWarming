Feature: Battles
  Scenario: Army Wins
    Given I start with an army of size 100
    Given the node I want to go to has a an army of size 50 not owned by me
    When I send my army to that node
    Then my army has 50 troops
    Then the enemy has 0 army remaining

  Scenario: Army Dies
    Given I start with an army of size 25
    Given the node I want to go to has a an army of size 50 not owned by me
    When I send my army to that node
    Then their army has 25 troops
    Then I have 0 army remaining