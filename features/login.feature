Feature: Login
   Scenario: A user attempts a valid login
      Given A login request
      When The password matches the users password in the database
      Then The server responds with a valid login response

   Scenario: A user attempts to login with a bad password
      Given A login request
      When The password does not match the users password in the database
      Then The server responds with an invalid login response
