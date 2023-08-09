/// <reference types="cypress"/>
import * as rn from './../../support/random';

describe('Verify the user registration', () => {
    var fixtureData;
    before(() => { 
        cy.fixture('register.json').then(data => {
          fixtureData = data;
        });
      });
    
    beforeEach(() => {
        cy.visit('https://member.daraz.com.np/user/register');
        cy.get('.login-title').contains('Create your Daraz Account');
      
        
    })
    
    

    it('Verify that phone number with already existing account can not be registered', () => {
        cy.get('.mod-input-phone > input').clear().type(fixtureData.existingPhone);
         cy.get('.mod-sendcode-btn').should('be.enabled').click();
        cy.get('.mod-dialog-cont').should('be.visible').should('contain','This phone number is linked to another account, please enter another number.');
    })

    it('Verify that phone number field cannot accept less than 10 digits.', () => {
        cy.get('.mod-input-phone > input').clear().type(rn.ranInt(9));
        cy.invalidPhone();
    })

    it('Verify that phone number field cannot accept more than 10 digits.', () => {
        cy.get('.mod-input-phone > input').clear().type(rn.ranInt(11));
        cy.invalidPhone();

    })

    it('Verify that phone number field cannot accepts alphabets, or any special characters.', () => {
        cy.get('.mod-input-phone > input').clear().type(rn.ranAlpha(10));
        cy.invalidPhone();
        cy.get('.mod-dialog-cont').should('be.visible').should('contain','Please enter a valid phone number.');
        cy.get('.ok').should('contain','ok').click();

        cy.get('.mod-input-phone > input').clear().type(rn.ranSpec(10));
        cy.invalidPhone();
        cy.get('.mod-dialog-cont').should('be.visible').should('contain','Please enter a valid phone number.');
        cy.get('.ok').should('contain','ok').click();

        cy.get('.mod-input-phone > input').clear().type(rn.ranAlpha(5)+rn.ranInt(5));
        cy.invalidPhone();
        cy.get('.mod-dialog-cont').should('be.visible').should('contain','Please enter a valid phone number.');
        cy.get('.ok').should('contain','ok').click();

        cy.get('.mod-input-phone > input').clear().type(rn.ranAlpha(3)+rn.ranSpec(2)+rn.ranInt(5));
        cy.invalidPhone();
        cy.get('.mod-dialog-cont').should('be.visible').should('contain','Please enter a valid phone number.');
    })

    it('Verify that "phone number" field cannot accept blank spaces.', () => {
        cy.get('.mod-input-phone > input').clear().type('          ');
         cy.get('.mod-sendcode-btn').should('be.enabled').click()
        cy.get('.mod-dialog-cont').should('be.visible').should('contain','Please enter a valid phone number.');
    })

    it('Verify that "phone number" field cannot be left empty.', () => {
        cy.get('.mod-input-phone > input').clear();
         cy.get('.mod-sendcode-btn').should('be.disabled');
    })

    it('Verify that emptying the phone number field displays the error message.', () => {
        cy.get('.mod-input-phone > input').clear().type(fixtureData.phone).clear();
        cy.get('.mod-input-phone > span').should('be.visible').should('contain',`You can't leave this empty.`);
    })

    it('Verify the enabled/disabled state of "send" button.', () => {
        cy.get('.mod-input-phone > input').clear();
         cy.get('.mod-sendcode-btn').should('be.disabled');
        cy.get('.mod-input-phone > input').clear().type(rn.ranInt(3));
         cy.get('.mod-sendcode-btn').should('be.enabled');
    })

    it('Verify that clicking the link "Get code via other methods" opens the popup modal with methods to receive verification code.', () => {
         cy.get('.mod-login-change-sms-type').click().then(data=>{
             cy.get('.sms-type-popup-content').should('be.visible');
             cy.get('button.sms-type-popup-whatsapp-button').should('be.visible');
             cy.get('button.sms-type-popup-viber-button').should('be.visible');
             cy.get('button.sms-type-popup-sms-button').should('be.visible');
        });
    })

    it('Verify that popup modal for "methods to receive verification code" can be closed.', () => {
         cy.get('.mod-login-change-sms-type').click().then(data=>{
             cy.get('.sms-type-popup-content').should('be.visible');
            cy.get('.next-dialog-close').click(); //closing dialog using close icon
        });
        cy.get('.next-dialog').should('not.exist');

         cy.get('.mod-login-change-sms-type').click().then(data=>{
             cy.get('.sms-type-popup-content').should('be.visible');
            // Simulate clicking outside of the dialog by clicking on the body
            cy.get('body').click(0,0);
        });
        cy.get('.next-dialog').should('not.exist');
    })

    it('Verify that invalid verification code cannot be used to register.', () => {
        cy.get('.mod-input-phone > input').clear().type(fixtureData.phone);
        cy.get('.mod-input-sms >input').clear().type(rn.ranInt(6));
       cy.get('.mod-input-password >input').clear().type(rn.ranInt(2)+rn.ranAlpha(5));
         cy.get('.mod-input-name >input').clear().type(rn.ranAlpha(5));
         cy.get('.mod-login-btn >button').click()
        cy.get('.next-feedback-content').should('contain','Invalid verification code.')
    })

    it('Verify that "verification code" input field does not accepts blank spaces, letters and special characters.', () => {
        cy.get('.mod-input-sms >input').clear().type('   ').should('have.value','');
        cy.get('.mod-input-sms >input').clear().type(rn.ranAlpha(5)).should('have.value','');
        cy.get('.mod-input-sms >input').clear().type(rn.ranSpec(4)).should('have.value','');
    })

    it('Verify that leaving "verification code" input field empty shows error message.', () => {
        cy.get('.mod-input-phone > input').clear().type(fixtureData.phone);
        cy.get('.mod-input-sms >input').clear(); 
        cy.get('.mod-input-password >input').clear().type(rn.ranInt(2)+rn.ranAlpha(5));
        cy.get('.mod-input-name >input').clear().type(rn.ranAlpha(5));
         cy.get('.mod-login-btn >button').click()
        cy.get('.next-feedback-content').should('contain','Please enter the sms code')
    })

    it('Verify that verification code field having less than 6 digits shows validation error message.', () => {
        cy.get('.mod-input-sms >input').clear().type(rn.ranInt(5));
        cy.get('.mod-input-sms > span').should('be.visible').should('contain','Please enter 6 digits');
    })

    it('Verify that verification code field having more than 6 digits shows validation error message.', () => {
        cy.get('.mod-input-sms >input').clear().type(rn.ranInt(7));
        cy.get('.mod-input-sms > span').should('be.visible').should('contain','Please enter 6 digits');
    })

    it('Verify that verification code field having 6 digits doesnot show any validation error message.', () => {
        cy.get('.mod-input-sms >input').clear().type(rn.ranInt(6));
        cy.get('.mod-input-sms > span').should('not.be.visible')
    })

    it('Verify that verification code can only be resend after 60 seconds in whatsapp/viber/SMS', () => {
        cy.get('.mod-input-phone > input').clear().type(fixtureData.phone);
        
        //for whatsapp
         cy.get('.mod-login-change-sms-type').click().then(data=>{
             cy.get('button.sms-type-popup-whatsapp-button').click();
        })
         cy.get('.mod-sendcode-btn').should('be.enabled').click()
        .should('be.disabled');
        cy.wait(60000); //waiting 60 seconds to resend verification code in whatsapp
         cy.get('.mod-sendcode-btn').should('be.enabled').should('contain','Resend').click();

        //for viber
         cy.get('.mod-login-change-sms-type').click().then(data=>{
             cy.get('button.sms-type-popup-viber-button').click();
        })
         cy.get('.mod-sendcode-btn').should('be.enabled').click()
        .should('be.disabled');
        cy.wait(60000); //waiting 60 seconds to resend verification code in viber
         cy.get('.mod-sendcode-btn').should('be.enabled').should('contain','Resend').click();

        //for sms
         cy.get('.mod-login-change-sms-type').click().then(data=>{
             cy.get('button.sms-type-popup-sms-button').click();
        })
         cy.get('.mod-sendcode-btn').should('be.enabled').click()
        .should('be.disabled');
        cy.wait(60000); //waiting 60 seconds to resend verification code in sms
         cy.get('.mod-sendcode-btn').should('be.enabled').should('contain','Resend').click();
    })

    it('Verify that leaving "password" input field empty shows error message.', () => {
       cy.get('.mod-input-password >input').clear();
        cy.get('.mod-input-phone > input').clear().type(fixtureData.phone);
        cy.get('.mod-input-sms >input').clear().type(rn.ranInt(6))
         cy.get('.mod-input-name >input').clear().type(rn.ranAlpha(5));
         cy.get('.mod-login-btn >button').click()

        cy.get('.mod-input-password > span').should('be.visible').should('contain',`You can't leave this empty.`);
    })

    it('Verify that password field cannot accept less than 6 characters.', () => {
       cy.get('.mod-input-password >input').clear().type(rn.ranInt(4)+rn.ranAlpha(1));
       cy.get('.mod-input-phone > input').clear().type(fixtureData.phone);
        cy.get('.mod-input-sms >input').clear().type(rn.ranInt(6))
         cy.get('.mod-input-name >input').clear().type(rn.ranAlpha(5));
         cy.get('.mod-login-btn >button').click()

        cy.get('.mod-input-password > span').should('be.visible').should('contain',`The length of Password should be 6-50 characters.`);
    })

    it('Verify that password field cannot accept more than 50 characters.', () => {
        cy.get('.mod-input-password >input').clear().type(rn.ranInt(44)+rn.ranAlpha(7));
        cy.get('.mod-input-phone > input').clear().type(fixtureData.phone);
         cy.get('.mod-input-sms >input').clear().type(rn.ranInt(6))
          cy.get('.mod-input-name >input').clear().type(rn.ranAlpha(5));
         cy.get('.mod-login-btn >button').click()

        cy.get('.mod-input-password > span').should('be.visible').should('contain',`The length of Password should be 6-50 characters.`);
    })

    it('Verify that password field can accept 6 valid characters.', () => {
       cy.get('.mod-input-password >input').clear().type(rn.ranInt(4)+rn.ranAlpha(2));

        cy.get('.mod-input-password > span').should('not.be.visible');
    })

    it('Verify that password field can accept 50 valid characters.', () => {
       cy.get('.mod-input-password >input').clear().type(rn.ranInt(44)+rn.ranAlpha(6));

        cy.get('.mod-input-password > span').should('not.be.visible');
    })

    it('Verify that password field cannot accepts character not having at least 1 digit and 1 letter', () => {
        //letters only
        cy.get('.mod-input-password >input').clear().type(rn.ranAlpha(6));
        cy.get('.mod-input-phone > input').clear().type(fixtureData.phone);
         cy.get('.mod-input-sms >input').clear().type(rn.ranInt(6))
          cy.get('.mod-input-name >input').clear().type(rn.ranAlpha(5));
         cy.get('.mod-login-btn >button').click()
        cy.get('.mod-input-password > span').should('be.visible').should('contain',`Password should contain alphabetic and numeric characters.`);

        //number only
       cy.get('.mod-input-password > input').clear().type(rn.ranInt(6));
        cy.get('.mod-input-password > span').should('be.visible').should('contain',`Password should contain alphabetic and numeric characters.`);
    })

    it('Verify that password field does not show error message for characters between 6-50 and containing at least 1 digit and 1 letter', () => {
       cy.get('.mod-input-password > input').clear().type(rn.ranInt(4)+rn.ranAlpha(6));
        cy.get('.mod-input-password > span').should('not.be.visible');

    })

    it('Verify that password should be encrypted when typed in the password field.', () => {
       cy.get('.mod-input-password > input').clear().type(rn.ranInt(4)+rn.ranAlpha(6)).should('have.attr','type','password')

    })

    it('Verify that password can be viewed and hidden using "password view icon".', () => {
        cy.get('.mod-input-password-icon').click();
       cy.get('.mod-input-password >input').clear().type(rn.ranInt(4)+rn.ranAlpha(6)).should('have.attr','type','password')

        cy.get('.mod-input-password-icon').click();
       cy.get('.mod-input-password >input').should('have.attr','type','text')

    })

    it('Verify that "password" input field does not accepts blank spaces only', () => {
       cy.get('.mod-input-password >input').clear().type('       ');
       cy.get('.mod-input-phone > input').clear().type(fixtureData.phone);
         cy.get('.mod-input-sms >input').clear().type(rn.ranInt(6))
          cy.get('.mod-input-name >input').clear().type(rn.ranAlpha(5));
         cy.get('.mod-login-btn >button').click()

        cy.get('.mod-input-password > span').should('be.visible').should('contain',`Password should contain alphabetic and numeric characters.`);
    })


    it('Verify that future date cannot be selected in the "birthday" field.', () => {
        cy.get('#month').click().then(month=>{
            cy.contains('December').click();
        })
        cy.get('#day').click().then(day=>{
            cy.contains('12').click();
        })
        const currentYear = new Date().getFullYear();
        cy.get('#year').click().then(year=>{
            cy.get('[value="2023"]').click();
            
        })
        cy.get('.mod-birthday-error').should('be.visible').should('contain',`Wrong birthday format`);
    })

    it('Verify that only one gender can be selected at a time.', () => {
        //selecting female
        cy.get('#gender').click();
        cy.get('[value="female"]').click();
        cy.get('#gender').should('have.text','Female').click();
        cy.get('li[value="female"]').should('have.class','selected');
        cy.get('li[value="male"]').should('not.have.class','selected');

        //selecting male
        // cy.get('#gender').click().then(($gender)=>{
        //     cy.get('[value="male"]').scrollIntoView().click();
        // })
        // cy.get('#gender').should('have.text','Male').click();
        // cy.get('li[value="male"]').should('have.class','selected');
        // cy.get('li[value="female"]').should('not.have.class','selected');

    })

    it('Verify that user cannot register with "Full Name" field being empty.', () => {
        cy.get('.mod-input-phone > input').clear().type(fixtureData.phone);
        cy.get('.mod-input-sms >input').clear().type(rn.ranInt(6))
       cy.get('.mod-input-password >input').clear().type(rn.ranInt(4)+rn.ranAlpha(7))
         cy.get('.mod-input-name >input').clear();
         cy.get('.mod-login-btn >button').click()

        cy.get('.mod-input-name > span').should('be.visible').should('contain',`You can't leave this empty.`);

    })
 
    it('Verify that user cannot register with full name having only empty blank spaces as value.', () => {
        cy.get('.mod-input-phone > input').clear().type(fixtureData.phone);
        cy.get('.mod-input-sms >input').clear().type(rn.ranInt(6))
       cy.get('.mod-input-password >input').clear().type(rn.ranInt(4)+rn.ranAlpha(7))
         cy.get('.mod-input-name >input').clear().type('    ');
         cy.get('.mod-login-btn >button').click()
        cy.url().should('include','user/register')

    })

    it('Verify that user cannot register with full name having less than 2 characters.', () => {
        cy.get('.mod-input-phone > input').clear().type(fixtureData.phone);
        cy.get('.mod-input-sms >input').clear().type(rn.ranInt(6))
       cy.get('.mod-input-password >input').clear().type(rn.ranInt(4)+rn.ranAlpha(7))
         cy.get('.mod-input-name >input').clear().type(rn.ranAlpha(1));
         cy.get('.mod-login-btn >button').click()
        cy.get('.mod-input-name > span').should('be.visible').should('contain',`The name length should be 2 - 50 characters.`);

    })

    it('Verify that user cannot register with full name having more than 50 characters.', () => {
        cy.get('.mod-input-phone > input').clear().type(fixtureData.phone);
        cy.get('.mod-input-sms >input').clear().type(rn.ranInt(6))
       cy.get('.mod-input-password >input').clear().type(rn.ranInt(4)+rn.ranAlpha(7))
         cy.get('.mod-input-name >input').clear().type(rn.ranAlpha(54));
         cy.get('.mod-login-btn >button').click()
        cy.get('.mod-input-name > span').should('be.visible').should('contain',`The name length should be 2 - 50 characters.`);

    })

    it('Verify that user cannot register with full name having 2 characters.', () => {
         cy.get('.mod-input-name >input').clear().type(rn.ranAlpha(2));
       
        cy.get('.mod-input-name > span').should('not.be.visible');

    })

    it('Verify that user cannot register with full name having 2 characters.', () => {
         cy.get('.mod-input-name >input').clear().type(rn.ranAlpha(50));
       
        cy.get('.mod-input-name > span').should('not.be.visible');

    })

    it('Verify that full name field does not show error message for characters between 2-50.', () => {
         cy.get('.mod-input-name >input').clear().type(rn.ranAlpha(14));
       
        cy.get('.mod-input-name > span').should('not.be.visible');

    })

    it('Verify that clear button clears the values typed in input field like phone number, password, and full name.', () => {
        cy.get('.mod-input-phone > input').clear().type(fixtureData.phone);
       cy.get('.mod-input-password >input').clear().type(rn.ranInt(4)+rn.ranAlpha(7))
         cy.get('.mod-input-name >input').clear().type(rn.ranAlpha(4));

        cy.get('.mod-input-phone .mod-input-close-icon').click()
        cy.get('.mod-input-phone > input').should('have.value','');

        cy.get('.mod-input-password .mod-input-close-icon').click()
       cy.get('.mod-input-password >input').should('have.value','');

        cy.get('.mod-input-name .mod-input-close-icon').click()
         cy.get('.mod-input-name >input').should('have.value','');

    })

    it('Verify that the user can register when required input fields are only filled with valid data', () => {
        cy.get('.mod-input-phone > input').clear().type(fixtureData.phone);
        cy.get('.mod-input-sms >input').clear().type(rn.ranInt(456123))//getting verification code manually to run the test
       cy.get('.mod-input-password >input').clear().type(rn.ranInt(4)+rn.ranAlpha(7))
         cy.get('.mod-input-name >input').clear().type(rn.ranAlpha(54));
         cy.get('.mod-login-btn >button').click();
        cy.url().should('not.include','user/register')

    })

    it('Verify that user can register evenwhen unchecking "exclusive offers and promotions" checkbox.', () => {
        cy.get('.mod-input-phone > input').clear().type(fixtureData.phone);
        cy.get('.mod-input-sms >input').clear().type(rn.ranInt(456123))//getting verification code manually to run the test
       cy.get('.mod-input-password >input').clear().type(rn.ranInt(4)+rn.ranAlpha(7))
         cy.get('.mod-input-name >input').clear().type(rn.ranAlpha(54));
        cy.get('#enableSmsNewsletter').check().should('be.checked');
         cy.get('.mod-login-btn >button').click()
        cy.url().should('not.include','user/register')

    })

    it('Verify that user can register evenwhen unchecking "exclusive offers and promotions" checkbox.', () => {
        cy.get('.mod-input-phone > input').clear().type(fixtureData.phone);
        cy.get('.mod-input-sms >input').clear().type(rn.ranInt(456123))//getting verification code manually to run the test
       cy.get('.mod-input-password >input').clear().type(rn.ranInt(4)+rn.ranAlpha(7))
         cy.get('.mod-input-name >input').clear().type(rn.ranAlpha(54));
        cy.get('#enableSmsNewsletter').uncheck().should('not.be.checked');
         cy.get('.mod-login-btn >button').click()
        cy.url().should('not.include','user/register')

    })

    it('Verify that clicking "login" link redirects to login page.', () => {
        cy.contains('a','Login').as('login');
        cy.get('@login').should('have.attr', 'href', '/user/login')
        .click().url().should('include','/user/login');
    })

    it('Verify that clicking "Terms of Use" link redirects to the "Terms of Use" page in another tab of browser.', () => {
        cy.contains('a','Terms of Use').as('t$c');
        cy.get('@t$c').should('have.attr', 'href', 'https://pages.daraz.com.np/wow/i/np/help-pages/terms-and-conditions')
        .invoke('removeAttr', 'target').click();
        cy.window().should('have.property', 'open');
        cy.url().should('include','https://pages.daraz.com.np/wow/i/np/help-pages/terms-and-conditions');
    })

    it('Verify that clicking "Privacy Policy" link redirects to the "Privacy Policy" page in another tab of browser.', () => {
        cy.contains('a','Privacy Policy').as('pp');
        cy.get('@pp').should('have.attr', 'href', 'https://pages.daraz.com.np/wow/i/np/help-pages/privacy')
        .invoke('removeAttr', 'target').click();
        cy.window().should('have.property', 'open');
        cy.url().should('include','https://pages.daraz.com.np/wow/i/np/help-pages/privacy');
    })









    
    





})