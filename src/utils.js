const {
  DISCOUNT10,
  DISCOUNT15,
  DISCOUNT20,
  BULKBUY2GET1,
  ABOVEAMOUNT,
  ABOVEDISCOUNT,
  DISCOUNT_TWENTY_PACKAGE
} = require('./constant.js');

module.exports = {
  /**
   * Receives an array of products and a string key to filter the products that its productCode
   * starts with the key
   * Returns an array of products with the result of the filter
  */
  filterProductsByDiscount: (items, key) =>{
    return items.filter(p => p.productCode.startsWith(key));
  },
  /**
   * Receives an array of products and a string key to group products with the same
   * value in the key received by params
   * Returns an Object with the following form:
   * {
   *      'BULK_BUY_2_GET_1-SCREEN': [
   *          {
   *             price: 55.99,
   *             productCode: 'BULK_BUY_2_GET_1-SCREEN',
   *             name: 'Screen 24 inches'
   *         }
   *      ],
   *      'BULK_BUY_2_GET_1-KEYBOARD': [
   *	       {
   *	       	price: 22.99,
  *	       	productCode: 'BULK_BUY_2_GET_1-KEYBOARD',
  *	       	name: 'Keyboard'
  *	       }
  *      ]
  * }
  */
  groupProductsBy: (items, key) => items.reduce(
    (result, item) => ({
        ...result,
        [item[key]]: [
        ...(result[item[key]] || []),
        item,
        ],
    }),
    {},
  ),

  /**
   * Receives an array of products and filter by its productCode
   * excluding the products with some type of discount
  */
  filterProductsWithoutDiscount: items => {
    return items.filter(
        p => !p.productCode.startsWith(DISCOUNT10)
            && !p.productCode.startsWith(DISCOUNT15)
            && !p.productCode.startsWith(DISCOUNT20)
            && !p.productCode.startsWith(BULKBUY2GET1)
            && !p.productCode.startsWith(DISCOUNT_TWENTY_PACKAGE)
    );
  },
  /**
   * Receives an array of products and an integer with the percentage discount
   * of each product.
   * The function calculates the total amount of all products, aplying the discount to each price
   * and it processing loyalty points.
   * One loyalty point are earned for each amount of the discount spent.
   * If the discount is zero, one loyalty point is earned by each $5 spent.
   * Returns two float values:
   * The first is the total amount of the products with the discount applied
   * The second is the loyalty points earned with the purchase
  */
  getTotalPriceAndLoyaltyPoints: (products, discount) => {
    let loyaltyPoints = 0;
    let totalPrice = 0;
    products.forEach(product => {
        loyaltyPoints += (discount !== 0) ? (product.price / discount) : (product.price / 5);
        totalPrice += product.price - ((product.price * discount)/100);
    })
    return [totalPrice, loyaltyPoints];
  },
    /**
     * Receives an array of products and an integer with the discount in fixed amount
     * The function calculates the total amount of all products, aplying the discount to total amount
     * One loyalty point are earned for each amount of the discount spent.
     * One loyalty point is earned by each $5 spent.
     * Returns two float values:
     * The first is the total amount of the products with the discount applied
     * The second is the loyalty points earned with the purchase
    */
  getTotalPriceAndLoyaltyPointsWithFixedDiscount: (products, discount) => {
    let loyaltyPoints = 0;
    let totalPrice = 0;
    products.forEach(product => {
        loyaltyPoints += product.price / 5;
        totalPrice += product.price;
    })
    if (totalPrice >= discount) totalPrice = totalPrice - discount;
    return [totalPrice, loyaltyPoints];
  },
  /**
   * Receives an Object of product codes and each key has like value an array with the products
   * that have this code.
   * The function calculates the total amount of each group of products considering that for each
   * two products, one of them is free
   * It calculates too the loyalty points with the rule that for each $5 spent,
   * one loyalty point is earned.
   * Returns two float values:
   * The first is the total amount of the products with the discount applied
   * The second is the loyalty points earned with the purchase
  */
  getBulkTwoGetOneProductsPriceAndLoyaltyPoints: groupedProducts => {
    let loyaltyPoints = 0;
    let totalPrice = 0;
    Object.keys(groupedProducts).forEach(key => {
        const products = groupedProducts[key];
        const totalProducts = getProductUnitsToApplyBulkTwoGetOne(products.length)
        totalPrice += products[0].price * totalProducts;
    });
    loyaltyPoints = totalPrice / 5;
    return [totalPrice, loyaltyPoints];
  },
  /**
   * Receives an amount to check if apply discount or not
   * considering above amount and above discount constants
   * Returns a float number
  */
  applyTotalPurchaseDiscount: amount => {
    let totalPrice = amount;
    if (amount > ABOVEAMOUNT){
        totalPrice -=  (totalPrice * ABOVEDISCOUNT)/100;
    }
    return totalPrice;
  },

  /**
   * Receives an array of products and it order them by its price
   * The first product is the most expensive and the last is the cheaper
   * Calculates the quantity of products to charge according the offer of 2 by 1
   * Gets the first N products with the higher prices to charge and to sum its prices
   * calculating too the loyalty points
   * Returns two float values:
   * The total amount of the products
   * The loyalty points earned with the purchase
  */
  getPriceAndPointsInBulkTwoGetOneProductsByPrice: products => {
    const orderedProducts = products.sort(function (x, y) {
        return y.price - x.price;
    });
    const totalProducts = getProductUnitsToApplyBulkTwoGetOne(orderedProducts.length)
    return getTotalPriceAndLoyaltyPoints(orderedProducts.slice(0, totalProducts), 0);
  }
}

/**
 *  Receives the quantity of products and calculates the integer part of the division for 2.
 *  If the integer part is zero, the size of products doesn't in in the offer and they should
 *  be charge completely.
 *  If the integer part isn't zero the products to charge is the size minus
 *  the result of the integer part of the division.
 *  For example: If the products size is 9, the products to charge are 5 because the
 *  integer part of the division is 4 and 9 minus 4 is 5.
 *  Returns an integer number
 */
const getProductUnitsToApplyBulkTwoGetOne = productsSize => {
  const floorProducts = Math.floor(productsSize / 2);
  return (floorProducts !== 0 ? (productsSize - Math.floor(productsSize / 2)) : productsSize);
};
