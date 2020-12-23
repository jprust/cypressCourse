// Alternative to describe
// context()

/// <reference types="cypress" />

// describe can be nested
describe('First test suite', () => {

    beforeEach('code before every test', () => {
        // repetitive code, counts for each describe it's nested in and its children
        cy.visit('/')
    })
    
    it('first test', () => {
        
    })


})