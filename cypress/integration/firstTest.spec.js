// Alternative to describe
// context()

/// <reference types="cypress" />

import { selectDayFromCurrent } from "../support/commands"

// describe can be nested
describe('First test suite', () => {

    beforeEach('code before every test', () => {
        // repetitive code, counts for each describe it's nested in and its children
        cy.visit('/')
    })

    it('first test', () => {
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        // by tag name
        cy.get('input')

        // find element by id (add # for ID)
        cy.get('#inputEmail1')

        // by class name (add . for class name) /attribute
        cy.get('.input-full-width')

        // by attribut name (add square brackets [] for attribute name)
        cy.get('[placeholder]')

        // by attribut name and value
        cy.get('[placeholder="Email"]')

        // by class value (requires []), need to provide all vallues
        cy.get('[class="input-full-width size-medium shape-rectangle"]')

        // by tag name AND attribute WITH value
        cy.get('input[placeholder="Email"]')

        // by two different attributes
        cy.get('[placeholder="Email"][type="email"]')

        // get by tag name, attribute with value, ID and class name
        cy.get('input[placeholder="Email"]#inputEmail1.input-full-width')

        // most recommended way by cypress --> create your own attributes/locators
        cy.get('[data-cy="imputEmail1"]')

    })

    it('second test', () => {
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.get('[data-cy="signInButton"]')

        cy.contains('Sign in')

        // add two queries
        cy.contains('[status="warning"]', 'Sign in')

        // getting element below the current one if no unique identifier is present
        cy.get('#inputEmail3')
            .parents('form')
            .find('button')
            .should('contain', 'Sign in')
            .parents('form')
            .find('nb-checkbox')
            .click()

        // nested contain with child query
        cy.contains('nb-card', 'Horizontal form').find('[type="email"]')
    })

    it('then and wrap methods', () => {
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        // long, simple approach
        cy.contains('nb-card', 'Using the Grid').find('[for="inputEmail1"]').should('contain', 'Email')
        cy.contains('nb-card', 'Using the Grid').find('[for="inputPassword2"]').should('contain', 'Password')

        cy.contains('nb-card', 'Basic form').find('[for="exampleInputEmail1"]').should('contain', 'Email address')
        cy.contains('nb-card', 'Basic form').find('[for="exampleInputPassword1"]').should('contain', 'Password')

        // cleaner approach, re-using code 
        // ES5 format for function (function Name (firstForm) {})
        cy.contains('nb-card', 'Using the Grid').then(firstForm => {
            const emailLabelFirst = firstForm.find('[for="inputEmail1"]').text()
            const passwordLabelFirst = firstForm.find('[for="inputPassword2"]').text()
            expect(emailLabelFirst).to.eq('Email')
            expect(passwordLabelFirst).to.eq('Password')

            cy.contains('nb-card', 'Basic form').then(secondForm => {
                const emailLabelSecond = secondForm.find('[for="exampleInputEmail1"]').text()
                const passwordLabelSecond = secondForm.find('[for="exampleInputPassword1"]').text()
                expect(passwordLabelFirst).to.eq(passwordLabelSecond)

                // switching from jQuery context back to cypress context
                cy.wrap(secondForm).find('[for="exampleInputPassword1"]').should('contain', 'Password')
            })
        })
    })
    it('invoke commands', () => {
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        // example 1
        cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address')

        // example 2
        cy.get('[for="exampleInputEmail1"]').then(inputLabel => {
            expect(inputLabel.text()).to.eq('Email address')
        })

        // example 3 --> skips jQuery on text
        cy.get('[for="exampleInputEmail1"]').invoke('text').then(text => {
            expect(text).to.eq('Email address')
        })

        // example 4 --> check if checkbox is checked
        cy.contains('nb-card', 'Basic form')
            .find('nb-checkbox').click()
            // find class value
            .find('.custom-checkbox')
            // invoke attribute with name: 'class'
            .invoke('attr', 'class')
            // .should('contain', 'checked')
            .then(classValue => {
                expect(classValue).to.contain('checked')
            })

        // example 5

    })

    it('assert value of HTML property', () => {

        cy.contains('Forms').click()
        cy.contains('Datepicker').click()

        // example 5
        cy.contains('nb-card', 'Common Datepicker').find('input').then(input => {
            cy.wrap(input).click()
            cy.get('nb-calendar-day-picker').contains('17').click()
            // assert on a property of the 
            cy.wrap(input).invoke('prop', 'value').should('contain', 'Dec 17, 2020')
        })

    })

    it('radio buttons', () => {

        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then(radioButtons => {
            cy.wrap(radioButtons)
                .first()
                .check({ force: true })
                .should('be', 'checked')
            // check 2 and uncheck 1
            cy.wrap(radioButtons)
                .eq(1)
                .check({ force: true })
            cy.wrap(radioButtons)
                .first()
                .should('not.be.checked')
            // assert third radio is disabled
            cy.wrap(radioButtons)
                .eq(2)
                .should('be.disabled')
        })
        // cy.contains('nb-radio', 'Option 1')

    })
    it('checkboxes', () => {

        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click()

        // .check only checks if unchecked, .click can also uncheck
        cy.get('[type="checkbox"]').check({ force: true })
        cy.get('[type="checkbox"]').eq(0).click({ force: true })
    })

    it('lists and dropdowns', () => {

        // example 1
        // drill down from parent nav to child nb-select
        cy.get('nav nb-select').click()
        // select option after list is open from different, new LIST element in DOM
        cy.get('.options-list').contains('Dark').click()
        // verify background color change through assertion on CSS style key+value
        cy.get('nb-layout-header nav').should('have.css', 'background-color', 'rgb(34, 43, 69)')
        // assert text in dropdown changed
        cy.get('nav nb-select').should('contain', 'Dark')

        // example 2
        cy.get('nav nb-select').then(dropdown => {
            cy.wrap(dropdown).click()
            // introducing cy.each as a forEach loop
            let index = 0
            cy.get('.options-list nb-option').each(listItem => {
                // trim for removing whitespace
                const itemText = listItem.text().trim()

                const colors = {
                    "Light": "rgb(255, 255, 255)",
                    "Dark": "rgb(34, 43, 69)",
                    "Cosmic": "rgb(50, 50, 89)",
                    "Corporate": "rgb(255, 255, 255)"
                }

                cy.wrap(listItem).click()
                // verify if itemText is in dropdown list
                cy.wrap(dropdown).should('contain', itemText)
                cy.get('nb-layout-header nav').should('have.css', 'background-color', colors[itemText])
                index++
                if (index < 4) { cy.wrap(dropdown).click() }

            })
        })
    })

    it('web tables', () => {

        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()
        // edit value in row
        cy.get('tbody').contains('tr', 'Larry').then(tableRow => {
            cy.wrap(tableRow).find('.nb-edit').click()
            cy.wrap(tableRow).find('[placeholder="Age"]').clear().type(25)
            cy.wrap(tableRow).find('.nb-checkmark').click()
            cy.wrap(tableRow).find('td').eq(6).should('contain', '25')
        })
        // add row
        cy.get('thead').find('.nb-plus').click()
        cy.get('thead').find('tr').eq(2).then(addRow => {
            cy.wrap(addRow).find('[placeholder="First Name"]').type('Jan')
            cy.wrap(addRow).find('[placeholder="Last Name"]').type('Doe')
            cy.wrap(addRow).find('.nb-checkmark').click()
        })
        cy.get('tbody tr').first().find('td').then(tableRow => {
            cy.wrap(tableRow).eq(2).should('contain', 'Jan')
            cy.wrap(tableRow).eq(3).should('contain', 'Doe')
        })
        // query rows
        const age = [20, 30, 40, 200]
        cy.wrap(age).each(age => {
            cy.get('thead [placeholder="Age"]').clear().type(age).wait(500)
            cy.get('tbody tr').each(tableRow => {
                if (age == 200) {
                    cy.wrap(tableRow).should('contain', 'No data found')
                } else {
                    cy.wrap(tableRow).find('td').eq(6).should('contain', age)
                }
            })
        })
    })

    it('Web Datepickers', () => {

        cy.contains('Forms').click()
        cy.contains('Datepicker').click()
        cy.contains('nb-card', 'Common Datepicker').find('input').then(input => {
            cy.wrap(input).click()
            let dateAssert = selectDayFromCurrent.selectDayFromCurrent(300)
            cy.wrap(input).invoke('prop', 'value').should('contain', dateAssert)
        })
    })

    it('pop ups and tooltips', () => {

        cy.contains('Modal & Overlays').click()
        cy.contains('Tooltip').click()

        // Cypress will keep DOM snapshots, allowing you to find elements currently showing
        cy.contains('nb-card', 'Colored Tooltips').contains('Default').click()
        cy.get('nb-tooltip').should('contain', 'This is a tooltip')

        // Same for normal in-window dialog boxes, as they are part of the DOM
    })

    it('pop ups and tooltips', () => {

        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()

        // dialog boxes as part of the browser

        // cypress doesn't see alert message, Cypress automatically confirms browser messages
        cy.get('tbody tr').first().find('.nb-trash').click()
        // Not the best way to to this:
        // cy.on can check windows, but only triggers once dialog is actually triggered
        cy.on('window:confirm', (confirm) => {
            expect(confirm).to.eq('Are you sure you want to delete?')
        })

        // Better way to do this is to stub the message
        // if window does not work, stub will be empty and getCall will fail
        const stub = cy.stub()
        cy.on('window:confirm', stub)
        cy.get('tbody tr').first().find('.nb-trash').click().then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Are you sure you want to delete?')
        })

        // example where we don't auto-confirm
        cy.get('tbody tr').first().find('.nb-trash').click()
        cy.on('window:confirm', () => false)
    })

    it('Cypress Assertions', () => {
        // Chai Assertions > .should('contain', '')
        // .should('have.class', 'label')
        // .and('have.text', 'Email address')

        // simple with cy.invoke for HTML property values
        // cy.wrap(input).invoke('prop', 'value').should('contain', dateAssert)
        // quicker alternative
        // cy.wrap(input).should('have.value', dateAssert)

        // BDD assertions > expect().to.be.x / 
        // expect(label).to.have.class('label')
        // expect(label).to.have.text('Email address')

        // TDD assertions > assert().isNot etc etc

        // Chai jQuery > work directly on elements expect($el)

        // Sinon Chai to use with cy.spy or cy.stub
    })
})
