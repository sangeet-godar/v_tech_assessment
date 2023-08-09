// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('invalidPhone', () => {
    cy.get('.mod-sendcode-btn').should('be.enabled').click()
    cy.get('.mod-dialog-cont').should('be.visible').should('contain','Please enter a valid phone number.');
})

Cypress.Commands.add('goingToItemPage', () => {
    cy.get('.lzd-site-nav-menu-dropdown').within(data=>{
        cy.contains('span','Electronic Devices').as('ed');
        cy.get('@ed').trigger('mouseover')
        cy.contains('span','Laptops').as('laptop')
        cy.get('@laptop').trigger('mouseover')
        cy.contains('Macbooks').as('mac')
        cy.get('@mac').scrollIntoView().click({force:true})
    })
})



