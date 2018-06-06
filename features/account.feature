Feature: Account
   Scenario: A user attempts an account creation
      Given A create account request
      When The username has not been taken
      Then The account is created
      Then The server responds with a valid account creation response

   Scenario: A user attempts an account creation with an already taken username
      Given A create account request
      When The username has been taken
      Then The account is not created
      Then The server responds with an invalid account creation response
