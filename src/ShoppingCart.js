"use strict";

const {
    DISCOUNT10,
    DISCOUNT15,
    DISCOUNT20,
    BULKBUY2GET1,
    DISCOUNT_TWENTY_PACKAGE
} = require('./constant.js');

const {
    filterProductsByDiscount,
    groupProductsBy,
    filterProductsWithoutDiscount,
    getTotalPriceAndLoyaltyPoints,
    getBulkTwoGetOneProductsPriceAndLoyaltyPoints,
    applyTotalPurchaseDiscount,
    getTotalPriceAndLoyaltyPointsWithFixedDiscount
} = require('./utils.js');

/**
* Checkout function calculates total price and total loyalty points earned by the customer.
* Products with product code starting with DIS_10 have a 10% discount applied.
* Products with product code starting with DIS_15 have a 15% discount applied.
* Products with product code starting with DIS_20 have a 20% discount applied.
* Products with product code starting with BULK_BUY_2_GET_1 have a special offer
    on group of each 2 products, get one product free
* Total purchase above $500 has a discount of 5%
* Loyalty points are earned more when the product is not under any offer.
    - Customer earns 1 point on every $5 purchase.
    - Customer earns 1 point on every $10 spent on a product with 10% discount.
    - Customer earns 1 point on every $15 spent on a product with 15% discount.
    - Customer earns 1 point on every $20 spent on a product with 20% discount.
*/
function ShoppingCart(items) {
    this.items = items;
    this.checkout = function(){
        const withTenDiscount = filterProductsByDiscount(this.items, DISCOUNT10);
        const withFifteenDiscount = filterProductsByDiscount(this.items, DISCOUNT15);
        const withTwentyDiscount = filterProductsByDiscount(this.items, DISCOUNT20);
        const twoByOneProducts = filterProductsByDiscount(this.items, BULKBUY2GET1);
        const tableAndChairDiscount = filterProductsByDiscount(this.items, DISCOUNT_TWENTY_PACKAGE);
        const otherProducts = filterProductsWithoutDiscount(this.items);
        // group products two by one by its productCode attribute
        const groupedTwoByOne = groupProductsBy(twoByOneProducts, "productCode");

        // get total and loyalty points by each group of products
        const [totalTen, loyaltyTen] = getTotalPriceAndLoyaltyPoints(withTenDiscount, 10);
        const [totalFifteen, loyaltyFifteen] = getTotalPriceAndLoyaltyPoints(withFifteenDiscount, 15);
        const [totalTwenty, loyaltyTwenty] = getTotalPriceAndLoyaltyPoints(withTwentyDiscount, 20);
        const [totalTwoByOne, loyaltyTwoByOne] = getBulkTwoGetOneProductsPriceAndLoyaltyPoints(
            groupedTwoByOne
        );
        const [totalOthers, loyaltyOthers] = getTotalPriceAndLoyaltyPoints(otherProducts, 0);
        const [
            totalTableAndChair,
            loyaltyTableAndChair
        ] = getTotalPriceAndLoyaltyPointsWithFixedDiscount(tableAndChairDiscount, 20);

        // sum all totals and loyalty points of each group of products
        let totalPrice = totalTen + totalFifteen + totalTwenty + totalTwoByOne + totalOthers + totalTableAndChair;
        let loyaltyPoints = loyaltyTen + loyaltyFifteen + loyaltyTwenty + loyaltyTwoByOne + loyaltyOthers + loyaltyTableAndChair;

        // If total purchase is above 500 has a discount of 5%
        totalPrice = applyTotalPurchaseDiscount(totalPrice);

        // returns total price and loyalty points calculated
        return { totalPrice: totalPrice, loyaltyPoints: loyaltyPoints };
    }
}

module.exports = ShoppingCart
