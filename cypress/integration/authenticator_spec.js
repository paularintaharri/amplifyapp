  describe('Authenticator:', function() {
    // Step 1: setup the application state
    beforeEach(function() {
      cy.visit('http://localhost:3000/');
    });
    
    describe('Sign In:', () => {
    it('allows a user to signin', () => {
        // Step 2: Take an action (Sign in)
       
        cy.frameLoaded()
        cy.get(selectors.signInSignInButton).type("user12345");
            //cy.get(selectors.signInPasswordInput).type("user12345");
            //cy.get(selectors.signInSignInButton).contains('Sign In').click();
      
            // Step 3: Make an assertion (Check for sign-out text)
            // cy.get(selectors.signOutButton).contains('Sign Out');

         
        });
        });
      
  });
 export const selectors = {
    // Auth component classes
    signInusernameInput: '[data-test="sign-in-username-input"]',
    signInPasswordInput: '[data-test="sign-in-password-input"]',
    signInSignInButton: '[data-test="sign-in-sign-in-button"]',
    signOutButton: '[data-test="sign-out-button"]'
  } 