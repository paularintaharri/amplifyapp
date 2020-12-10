import { wait } from "@testing-library/react";

  describe('Authenticator:', function() {
    // Step 1: setup the application state
    beforeEach(function() {
      cy.visit('/');
    });

    const USERNAME = "user12345";
    const PASSWORD = "user12345";
    
    describe('Sign In:', () => {
    it('allows a user to signin', () => {
      
        // Step 2: Take an action (Sign in)
        cy.get("amplify-authenticator").find(selectors.signInusernameInput, {
          includeShadowDom: true,
        })
        .type(USERNAME);

        cy.get("amplify-authenticator").find(selectors.signInPasswordInput, {
          includeShadowDom: true,
        })
        .type(PASSWORD, { force: true });
        
        cy.get("amplify-authenticator").find(selectors.signInSignInButton, {
          includeShadowDom: true,
        })
        .first()
        .find("button[type='submit']", { includeShadowDom: true })
        .click({ force: true })
        .wait(6000);

      // Step 3: Make an assertion (Check for sign-out text)
      cy.get("amplify-sign-out").find(selectors.signOutButton, { includeShadowDom: true })
        .contains("Sign Out");
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