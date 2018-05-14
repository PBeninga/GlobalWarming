Feature: Battles
  Scenario: Army Wins
    Given I start with an army of size 100
    Given the node I want to go to has a an army of size 50 not owned by me
    When I send my army to that node
    Then a battle commences
    Then the enemy army gets destroyed
    Then that node holds my army

  Scenario: Army Dies
    Given I start with an army of size 25
    Given the node I want to go to has a an army of size 50 not owned by me
    When I send my army to that node
    Then a battle commences
    Then my army gets destroyed
    Then that node holds the enemies army
