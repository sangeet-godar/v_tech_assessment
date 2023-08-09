/// <reference types="cypress"/>
import * as rn from './../../support/random';

describe('Verify the add to cart', () => {
    var fixtureData;
    before(() => { 
        cy.fixture('register.json').then(data => {
          fixtureData = data;
        });
      });
    
    beforeEach(() => {
        cy.visit('https://member.daraz.com.np/user/login');
        cy.get('.mod-input-loginName > input').clear().type(fixtureData.existingPhone);
        cy.get('.mod-input-password > input').clear().type(fixtureData.password);
        cy.visit('https://www.daraz.com.np');
    })
    
    it('Verify that user can add a single item to the cart.', () => {
        cy.goingToItemPage();
        cy.contains('MacBook Pro 16" 10C CPU, 32C GPU, 32GB, 1TB SSD- EvoStore').click({force:true});
        cy.contains('button','Add to Cart').click();
        cy.get('.cart-message-text').should('contain','1 new item(s) have been added to your cart');
        
    })
    
    it('Verify that modal displaying the add to cart message can be closed.', () => {
        cy.goingToItemPage();
        cy.contains('MacBook Pro 16" 10C CPU, 32C GPU, 32GB, 1TB SSD- EvoStore').click({force:true});
        cy.contains('button','Add to Cart').click();
        cy.get('next-dialog-close').click();
        cy.get('next-dialog').should('not.exist');
        
    })

    it('Verify that user can navigate to the cart page after adding item to the cart', () => {
        cy.goingToItemPage();
        cy.contains('MacBook Pro 16" 10C CPU, 32C GPU, 32GB, 1TB SSD- EvoStore').click({force:true});
        cy.contains('button','Add to Cart').click();
        cy.contains('button','GO TO CART').click();
        cy.url().should('include','https://cart.daraz.com.np/cart')
    })

    it('Verify that user can navigate to the cart page using cart icon.', () => {
        cy.goingToItemPage();
        cy.get('.lzd-nav-cart').click()
        cy.url().should('include','https://cart.daraz.com.np/cart')
    })

    it('Verify that user can add multiple items to the cart.', () => {
        cy.goingToItemPage();
        cy.contains('button','Add to Cart').click();
        cy.get('.cart-message-text').should('contain','1 new item(s) have been added to your cart');
        cy.get('next-dialog-close').click();
        cy.get('.product-info').eq(0).click({force:true});
        cy.contains('button','Add to Cart').click();
        cy.get('.cart-message-text').should('contain','1 new item(s) have been added to your cart');
    })

    it('Verify that user can add item with specfic quantity to the cart.', () => {
        cy.goingToItemPage();
        cy.get('.next-number-picker-input-wrap > span > input').clear().type('2');
        cy.contains('button','Add to Cart').click();
        cy.get('.cart-message-text').should('contain','2 new item(s) have been added to your cart');
    })

    it('Verify that user can not add item less than 1 quantity to the cart.', () => {
        cy.goingToItemPage();
        cy.get('.next-number-picker-handler-down-inner').should('have.attr','unselectable','unselectable')
        cy.get('.next-number-picker-input-wrap > span > input').clear().type('0').should('not.have.value','0')
    })

    it('Verify that user can not add item with alphabetic or special character quantity to the cart.', () => {
        cy.goingToItemPage();
        cy.get('.next-number-picker-handler-down-inner').should('have.attr','unselectable','unselectable')
        cy.get('.next-number-picker-input-wrap > span > input').clear().type(rn.ranAlpha(2)).should('not.have.value',rn.ranAlpha(2))
    })

    it('Verify that the item added to the cart shows the same item as clicking on "Add to Cart".', () => {
        cy.goingToItemPage();
        cy.contains('MacBook Pro 16" 10C CPU, 32C GPU, 32GB, 1TB SSD- EvoStore').click({force:true});
        cy.contains('button','Add to Cart').click();
        cy.contains('button','GO TO CART').click();
        cy.url().should('include','https://cart.daraz.com.np/cart')
        cy.contains('MacBook Pro 16" 10C CPU, 32C GPU, 32GB, 1TB SSD- EvoStore').as('mac')
        cy.get('@mac').should('be.visible').should('exist')
    })

    it('Verify that item quantity cannot be more than available while adding to the cart', () => {
        cy.goingToItemPage();
        cy.get('.next-number-picker-input-wrap > span > input').clear().type('99').should('not.have.value','99')
    })

    it('Verify that item with all available quantity added to the cart cannot be again added to the cart.', () => {
        cy.goingToItemPage();
        cy.contains('MacBook Pro 16" 10C CPU, 32C GPU, 32GB, 1TB SSD- EvoStore').click({force:true});
        cy.get('.next-number-picker-input-wrap > span > input').type('2').should('have.value','2')
        cy.contains('button','Add to Cart').click();
        cy.get('next-dialog-close').click();
        cy.contains('button','Add to Cart').click();
        cy.get('.next-feedback-content').should('contain','The maximum quantity available for this item is 2.');
        
    })

    it('Verify the count shown on the cart icon gets updated when the user adds any item to the cart.', () => {
        cy.goingToItemPage();
        cy.contains('MacBook Pro 16" 10C CPU, 32C GPU, 32GB, 1TB SSD- EvoStore').click({force:true});
        cy.get('.cart-num').invoke('text').as('initialCount');
        cy.contains('button','Add to Cart').click();
        cy.get('next-dialog-close').click();
        cy.get('.cart-num').invoke('text').as('updatedCount');
        cy.get('@initialCount').then((initialCount) => {
            cy.get('@updatedCount').then((updatedCount) => {
              expect(parseInt(updatedCount)).to.be.greaterThan(parseInt(initialCount));
            });
        })
    })

    it('Verify that "Just For You" items gets shown when item is added to cart.".', () => {
        cy.goingToItemPage();
        cy.contains('MacBook Pro 16" 10C CPU, 32C GPU, 32GB, 1TB SSD- EvoStore').click({force:true});
        cy.contains('button','Add to Cart').click();
        cy.get('.recommend-product-list').should('be.visible');
    })


    it('Verify that only selected items price is shown as total price in the cart.', () => {
        cy.goingToItemPage();
        cy.contains('button','Add to Cart').click();
        cy.get('next-dialog-close').click();
        cy.get('.product-info').eq(0).click({force:true});
        cy.contains('button','Add to Cart').click();
        cy.contains('button','GO TO CART').click();
        cy.get('.checkout-summary-noline-value').eq(0).should('contain','Rs. 0');
        cy.get('.cart-item-checkbox').eq(0).click();
        cy.get('.current-price').eq(0).invoke('text').as('initialvalue')
        cy.get('.checkout-summary-noline-value').eq(0).invoke('text').as('finalvalue')
        cy.get('@finalvalue').then((finalvalue) => {
            cy.get('@initialvalue').should('eq', finalvalue);
        })

    })

    it('Verify that multiple items of a store in the cart can be deleted. ', () => {
        cy.goingToItemPage();
        cy.contains('button','Add to Cart').click();
        cy.get('next-dialog-close').click();
        cy.get('.product-info').eq(0).click({force:true});
        cy.contains('button','Add to Cart').click();
        cy.contains('button','GO TO CART').click();
        cy.get('.cart-item-checkbox').eq(0).click();
        cy.get('.cart-item-checkbox').eq(1).click();
        cy.contains('span','DELETE').click();
        cy.contains('button','REMOVE').click();
    })

    it('Verify that all items of the cart can be deleted at once. ', () => {
        cy.goingToItemPage();
        cy.contains('button','Add to Cart').click();
        cy.get('next-dialog-close').click();
        cy.get('.product-info').eq(0).click({force:true});
        cy.contains('button','Add to Cart').click();
        cy.contains('button','GO TO CART').click();
        cy.get('.next-checkbox-inner').eq(0).click();
        cy.contains('span','DELETE').click();
        cy.contains('button','REMOVE').click();
    })
    it('Verify that a single item of a store in the cart can be deleted without selecting it.', () => {
        cy.goingToItemPage();
        cy.contains('button','Add to Cart').click();
        cy.contains('button','GO TO CART').click();
        cy.get('.automation-btn-delete').last().click();
        cy.contains('button','REMOVE').click();
    })
})