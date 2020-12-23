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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

function selectGroupMenuItem(groupName) {

    cy.contains('a', groupName).then(menu => {
        cy.wrap(menu).find('.expand-state g g').invoke('attr', 'data-name')
            .then(attr => {
                if (attr.includes('left'))
                    cy.wrap(menu).click()
            })
    })
}

function selectDayFromCurrent(day) {
    // date picker with flexible date selection in HTML property
    // JavaScript Date method
    let date = new Date()
    date.setDate(date.getDate() + day)
    let futureDay = date.getDate()
    let futureMonth = date.toLocaleString('default', { month: 'short' })
    let futureYear = date.getFullYear()
    let dateAssert = futureMonth + ' ' + futureDay + ', ' + futureYear

    cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then(dateAttribute => {
        if (!dateAttribute.includes(futureMonth)) {
            cy.get('[data-name="chevron-right"]').click()
            selectDayFromCurrent(day)
        } else {
            cy.get('nb-calendar-day-picker [class="day-cell ng-star-inserted"]').contains(futureDay).click()
        }
    })
    return dateAssert
}
function selectDateRange(day) {
    // date picker with flexible date selection in HTML property
    // JavaScript Date method
    let date = new Date()
    date.setDate(date.getDate() + day)
    let futureDay = date.getDate()
    let futureMonth = date.toLocaleString('default', { month: 'short' })
    let futureYear = date.getFullYear()
    let dateAssert = futureMonth + ' ' + futureDay + ', ' + futureYear

    cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then(dateAttribute => {
        if (!dateAttribute.includes(futureMonth)) {
            cy.get('[data-name="chevron-right"]').click()
            selectDateRange(day)
        } else {
            cy.get('nb-calendar-day-picker [class="range-cell ng-star-inserted"] [class="day-cell"]').contains(futureDay).click()
        }
    })
    return dateAssert
}
function getLatestId() {
  
cy.get('tbody tr').last().find('td').eq(1).find('div').first().invoke('prop', 'textContent').then( id => {
    cy.wrap.as('id')
})
}

export class SelectDate {
    selectDayFromCurrent(day)
    selectDateRange(startDate, endDate)
}
export const selectDayFromCurrent = new SelectDate()


export class NavigationPage {

    formLayoutsPage() {
        selectGroupMenuItem('Forms')
        cy.contains('Form Layouts').click()
    }
    datepickerPage() {
        selectGroupMenuItem('Forms')
        cy.contains('Datepicker').click()
    }
    toasterPage() {
        selectGroupMenuItem('Modal & Overlays')
        cy.contains('Toastr').click()
    }
    tooltipPage() {
        selectGroupMenuItem('Modal & Overlays')
        cy.contains('Tooltip').click()
    }
    smartTablePage() {
        selectGroupMenuItem('Tables & Data')
        cy.contains('Smart Table').click()
    }
}
export const navigateTo = new NavigationPage()

export class FormLayoutsPage {

    submitInlineFormWithNameAndEmail(name, email) {
        cy.contains('nb-card', 'Inline form').find('form').then(form => {
            cy.wrap(form).find('[placeholder="Jane Doe"]').type(name)
            cy.wrap(form).find('[placeholder="Email"]').type(email)
            cy.wrap(form).find('[type="checkbox"]').check({ force: true })
            cy.wrap(form).submit()
        })
    }
    submitBasicForm(email, password) {
        cy.contains('nb-card', 'Basic form').find('form').then(form => {
            cy.wrap(form).find('[placeholder="Email"]').type(email)
            cy.wrap(form).find('[placeholder="Password"]').type(password)
            cy.wrap(form).find('[type="checkbox"]').check({ force: true })
            cy.wrap(form).submit()
        })
    }

}
export const onFormLayoutsPage = new FormLayoutsPage()

export class DatepickerPage {

    pickDateTomorrow(day) {
        cy.contains('nb-card', 'Common Datepicker').find('input').then(input => {
            cy.wrap(input).click()
            let dateAssert = selectDayFromCurrent(day)
            cy.wrap(input).invoke('prop', 'value').should('contain', dateAssert)
        })

    }

    pickDateRange(startDate, endDate) {
        cy.contains('nb-card', 'Datepicker With Range').find('input').then(input => {
            cy.wrap(input).click()
            let dateAssertStartDate = selectDateRange(startDate)
            let dateAssertEndDate = selectDateRange(endDate)
            cy.wrap(input).invoke('prop', 'value').should('contain', dateAssertStartDate + ' - ' + dateAssertEndDate)
        })

    }
}
export const onDatepickerPage = new DatepickerPage()

export class SmartTable {

    editValue(uniqueQueryElement, attributeToChange, newValue) {
        // edit value in row
        const columnID = {
            "ID": 1,
            "First Name": 2,
            "Last Name": 3,
            "Username": 4,
            "E-mail": 5,
            "Age": 6
        }
        cy.get('tbody').contains('tr', uniqueQueryElement).then(tableRow => {
            cy.wrap(tableRow).find('.nb-edit').click()
            cy.wrap(tableRow).find('[placeholder="' + attributeToChange + '"]').clear().type(newValue)
            cy.wrap(tableRow).find('.nb-checkmark').click()
            cy.wrap(tableRow).find('td').eq(columnID[attributeToChange]).should('contain', newValue)
        })
    }

    addNewRecord(firstName, lastName, userName, email, age) {
        // get highest record ID in Table
        cy.get('nb-card-body').find('[class="ng2-smart-pagination-nav ng-star-inserted"]').find('[aria-label="Last"]').click()
        cy.get('tbody tr').last().find('td').eq(1).find('div').first().invoke('prop', 'textContent').then(id => {
            const newID = parseInt(id) + 1
            cy.get('nb-card-body').find('[class="ng2-smart-pagination-nav ng-star-inserted"]').find('[aria-label="First"]').click()
            // add row
            cy.get('thead').find('.nb-plus').click()
            cy.get('thead').find('tr').eq(2).then(addRow => {
                cy.wrap(addRow).find('[placeholder="ID"]').type(newID)
                cy.wrap(addRow).find('[placeholder="First Name"]').type(firstName)
                cy.wrap(addRow).find('[placeholder="Last Name"]').type(lastName)
                cy.wrap(addRow).find('[placeholder="Username"]').type(userName)
                cy.wrap(addRow).find('[placeholder="E-mail"]').type(email)
                cy.wrap(addRow).find('[placeholder="Age"]').type(age)
                cy.wrap(addRow).find('.nb-checkmark').click()
            })
            cy.get('tbody tr').first().find('td').then(tableRow => {
                cy.wrap(tableRow).eq(1).should('contain', newID)
                cy.wrap(tableRow).eq(2).should('contain', firstName)
                cy.wrap(tableRow).eq(3).should('contain', lastName)
                cy.wrap(tableRow).eq(4).should('contain', userName)
                cy.wrap(tableRow).eq(5).should('contain', email)
                cy.wrap(tableRow).eq(6).should('contain', age)

            })
        })

    }


}
export const onSmartTablePage = new SmartTable()