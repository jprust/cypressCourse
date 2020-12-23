// Alternative to describe
// context()

/// <reference types="cypress" />

import { navigateTo, onDatepickerPage, onFormLayoutsPage, onSmartTablePage } from "../support/commands"

// describe can be nested
describe('second test suite', () => {

    beforeEach('code before every test', () => {
        // repetitive code, counts for each describe it's nested in and its children
        cy.visit('/')
    })

    it('Verify Navigation across the pages', () => {
        navigateTo.formLayoutsPage()
        navigateTo.datepickerPage()
        navigateTo.smartTablePage()
        navigateTo.toasterPage()
        navigateTo.tooltipPage()
    })

    it.only('Should submit Inline and Basic form and select tomorrow date in the calender', () => {
        // navigateTo.formLayoutsPage()
        // onFormLayoutsPage.submitInlineFormWithNameAndEmail('Jan Doe', 'jdoe@hotmail.com')
        // onFormLayoutsPage.submitBasicForm('Jan Doe', 'wachtwoord')
        // navigateTo.datepickerPage()
        // onDatepickerPage.pickDateTomorrow(1)
        // onDatepickerPage.pickDateRange(1, 15)
        navigateTo.smartTablePage()
        onSmartTablePage.editValue('Larry', 'Last Name', 'Trump')
        onSmartTablePage.addNewRecord('Jan', 'Doe', 'jdoe', 'jandoe@hotmail.com','26')


    })


})